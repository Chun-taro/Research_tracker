<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\ResearchGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $schedules = Schedule::where('tenant_id', $tenantId)
            ->with('group.students', 'group.adviser')
            ->orderBy('scheduled_at')
            ->paginate(15);

        $groups = ResearchGroup::where('tenant_id', $tenantId)->get(['id', 'title']);

        return Inertia::render('Admin/Schedules/Index', compact('schedules', 'groups'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'research_group_id' => 'required|exists:research_groups,id',
            'type' => 'required|in:proposal_defense,final_defense,consultation',
            'scheduled_at' => 'required|date|after:now',
            'venue' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $data['tenant_id'] = $request->user()->tenant_id;
        Schedule::create($data);

        return back()->with('success', 'Schedule created.');
    }

    public function update(Request $request, Schedule $schedule)
    {
        $data = $request->validate([
            'scheduled_at' => 'required|date',
            'venue' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:scheduled,done,cancelled',
        ]);

        $schedule->update($data);
        return back()->with('success', 'Schedule updated.');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return back()->with('success', 'Schedule deleted.');
    }

    public function adviserIndex(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $schedules = Schedule::where('tenant_id', $tenantId)
            ->whereHas('group', fn ($q) => $q->where('adviser_id', $request->user()->id))
            ->with('group')
            ->orderBy('scheduled_at')
            ->get();

        return Inertia::render('Adviser/Schedules/Index', compact('schedules'));
    }

    public function studentIndex(Request $request)
    {
        $user = $request->user();
        $group = $user->groupMemberships()->first()?->group;

        $schedules = $group
            ? Schedule::where('tenant_id', $user->tenant_id)->where('research_group_id', $group->id)->orderBy('scheduled_at')->get()
            : collect();

        return Inertia::render('Student/Schedules/Index', compact('schedules', 'group'));
    }
}
