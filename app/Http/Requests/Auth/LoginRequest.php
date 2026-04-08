<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

        $email = $this->input('email');
        $password = $this->input('password');

        // Identify current host context
        $host = $this->getHost();
        $landlordDomains = config('multitenancy.landlord_domains', ['localhost', '127.0.0.1']);
        $isLandlordDomain = in_array($host, $landlordDomains);

        // 1. LANDLORD DOMAIN AUTHENTICATION
        if ($isLandlordDomain) {
            $centralUser = \App\Models\Landlord\CentralUser::where('email', $email)
                ->where('is_active', true)
                ->first();

            if (!$centralUser || !Hash::check($password, $centralUser->password)) {
                RateLimiter::hit($this->throttleKey());
                throw ValidationException::withMessages(['email' => trans('auth.failed')]);
            }

            // Only Superadmins can log in to the central portal
            if ($centralUser->role !== 'superadmin') {
                throw ValidationException::withMessages([
                    'email' => 'Department users must log in through their specific department domain.',
                ]);
            }

            Auth::login($centralUser, $this->boolean('remember'));
        } 
        // 2. TENANT DOMAIN AUTHENTICATION
        else {
            // The tenant is already resolved via DomainTenantFinder or Smart Switch in Middleware
            $currentTenant = app(\Spatie\Multitenancy\Models\Tenant::class)::current();

            if (!$currentTenant) {
                throw ValidationException::withMessages([
                    'email' => 'Could not identify department for this domain.',
                ]);
            }

            // Authenticate directly against the Tenant Database
            $tenantUser = \App\Models\User::where('email', $email)->first();

            if (!$tenantUser || !Hash::check($password, $tenantUser->password)) {
                RateLimiter::hit($this->throttleKey());
                throw ValidationException::withMessages(['email' => trans('auth.failed')]);
            }

            if (!$tenantUser->is_active) {
                throw ValidationException::withMessages([
                    'email' => 'This account has been deactivated by the department administrator.',
                ]);
            }

            // Ensure a superadmin isn't trying to log in as a student/admin here unless they have an account
            if ($tenantUser->role === 'superadmin') {
                throw ValidationException::withMessages([
                    'email' => 'System administrators must log in through the central portal.',
                ]);
            }

            Auth::login($tenantUser, $this->boolean('remember'));
        }

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
