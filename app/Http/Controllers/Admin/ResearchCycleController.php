<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResearchCycle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResearchCycleController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $cycles = ResearchCycle::where('tenant_id', $tenantId)
            ->withCount('researchGroups')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Admin/Cycles/Index', compact('cycles'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20',
            'semester' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'proposal_deadline' => 'nullable|date',
            'chapter_deadline' => 'nullable|date',
            'final_deadline' => 'nullable|date',
            'defense_deadline' => 'nullable|date',
        ]);

        $data['tenant_id'] = $request->user()->tenant_id;
        ResearchCycle::create($data);

        return back()->with('success', 'Research cycle created.');
    }

    public function update(Request $request, ResearchCycle $cycle)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20',
            'semester' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'proposal_deadline' => 'nullable|date',
            'chapter_deadline' => 'nullable|date',
            'final_deadline' => 'nullable|date',
            'defense_deadline' => 'nullable|date',
            'status' => 'required|in:active,archived',
        ]);

        $cycle->update($data);
        return back()->with('success', 'Research cycle updated.');
    }

    public function destroy(ResearchCycle $cycle)
    {
        $cycle->delete();
        return back()->with('success', 'Research cycle archived.');
    }
}
