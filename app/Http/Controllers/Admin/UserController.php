<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Landlord\CentralUser;
use App\Mail\WelcomeUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $query = User::where('tenant_id', $tenantId)->withTrashed();

        if ($request->filled('search')) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$request->search}%")->orWhere('email', 'like', "%{$request->search}%"));
        }
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('name')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email', 
            'role' => 'required|in:admin,adviser,panelist,student',
            'password' => 'nullable|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        $tenant = app('currentTenant');
        $data['tenant_id'] = $tenant->id;
        
        // Handle random password
        $plainPassword = $request->filled('password') ? $request->password : Str::random(12);
        $hashedPassword = Hash::make($plainPassword);

        // 1. Create/Update Central User (SSO Hub)
        $centralUser = CentralUser::updateOrCreate(
            ['email' => $request->email],
            [
                'name' => $data['name'],
                'password' => $hashedPassword,
                'role' => $data['role'],
                'tenant_id' => $tenant->id,
                'is_active' => true,
            ]
        );

        // 2. Create Tenant Profile
        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => $data['name'],
            'email' => $request->email,
            'email_hash' => hash('sha256', $request->email), // Keep hash for legacy if needed, but primary is email
            'role' => $data['role'],
            'phone' => $data['phone'] ?? null,
            'is_active' => true,
        ]);

        // 3. Send Welcome Email
        Mail::to($request->email)->send(new WelcomeUser($centralUser, $plainPassword));

        return back()->with('success', 'User created successfully and credentials emailed.');
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$user->id}",
            'role' => 'required|in:admin,adviser,panelist,student',
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($data);

        // Also update CentralUser if found
        CentralUser::where('email', $user->getOriginal('email'))->update([
            'email' => $data['email'],
            'name' => $data['name'],
            'role' => $data['role'],
        ]);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'User archived successfully.');
    }

    public function toggleStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        return back()->with('success', 'User status updated.');
    }
}
