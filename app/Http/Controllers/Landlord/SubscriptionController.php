<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index()
    {
        return Inertia::render('Landlord/Subscriptions/Index', [
            'subscriptions' => Subscription::with('tenant')->latest()->paginate(10),
            'payments' => Payment::with('tenant')->latest()->take(10)->get(),
            'revenue_total' => Payment::where('status', 'paid')->sum('amount'),
        ]);
    }
}
