<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SupportController extends Controller
{
    /**
     * Display a listing of tickets for the current tenant.
     */
    public function index()
    {
        $user = Auth::user();
        $query = SupportTicket::with('user:id,name,role')
            ->where('tenant_id', $user->tenant_id);

        // Regular users only see their own tickets, admins see all for the tenant
        if (!$user->isAdmin() && !$user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        $tickets = $query->latest()->get();

        return Inertia::render('Admin/Support/Index', [
            'tickets' => $tickets
        ]);
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:bug,feature_request,support,other',
            'priority' => 'required|in:low,medium,high,critical',
        ]);

        SupportTicket::create([
            'tenant_id' => Auth::user()->tenant_id,
            'user_id' => Auth::id(),
            'subject' => $request->subject,
            'description' => $request->description,
            'type' => $request->type,
            'priority' => $request->priority,
            'status' => 'open',
        ]);

        return redirect()->back()->with('success', 'Support ticket submitted successfully. We will review it shortly!');
    }
}
