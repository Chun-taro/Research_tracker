<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $email = $this->string('email');
        $password = $this->string('password');

        // 1. Authenticate against Central Hub (Landlord DB)
        $centralUser = \App\Models\Landlord\CentralUser::where('email', $email)
            ->where('is_active', true)
            ->first();

        // Security: Ensure user belongs to the current department
        $currentTenant = app(\Spatie\Multitenancy\Models\Tenant::class)::current();
        
        if (!$centralUser || !Hash::check($password, $centralUser->password) || ($currentTenant && $centralUser->tenant_id != $currentTenant->id)) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        // 2. Resolve to Department Profile (Tenant DB) via Anonymized Hash
        $emailHash = hash('sha256', $email);
        $tenantUser = \App\Models\User::where('email_hash', $emailHash)->first();

        if (!$tenantUser) {
            // Profile missing in this department
            throw ValidationException::withMessages([
                'email' => 'This account exists in the system but is not registered for this department.',
            ]);
        }

        if (!$tenantUser->is_active) {
             throw ValidationException::withMessages([
                'email' => 'This account has been deactivated by the department administrator.',
            ]);
        }

        Auth::login($tenantUser, $this->boolean('remember'));
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
