<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $tenant = Tenant::find($request->user()->tenant_id);
        return Inertia::render('Admin/Settings/Index', compact('tenant'));
    }

    public function update(Request $request)
    {
        $tenant = Tenant::find($request->user()->tenant_id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'theme_color' => 'required|string|max:20',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($tenant->logo_path) Storage::delete($tenant->logo_path);
            $data['logo_path'] = $request->file('logo')->store("logos/{$tenant->id}", 'public');
        }
        unset($data['logo']);

        $tenant->update($data);

        return back()->with('success', 'Settings updated.');
    }
}
