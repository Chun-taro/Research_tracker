<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    /**
     * Display a listing of all support tickets.
     */
    public function index()
    {
        $tickets = SupportTicket::with(['tenant', 'user'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Landlord/Support/Index', [
            'tickets' => $tickets
        ]);
    }

    /**
     * Update the ticket status and add notes.
     */
    public function update(Request $request, SupportTicket $ticket)
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
            'admin_notes' => 'nullable|string',
        ]);

        $ticket->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        return redirect()->back()->with('success', 'Ticket updated successfully!');
    }
}
