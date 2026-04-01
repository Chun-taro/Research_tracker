<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResearchGroup;
use App\Models\User;
use App\Models\PanelistAssignment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResearchGroupController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $query = ResearchGroup::where('tenant_id', $tenantId)
            ->with(['adviser', 'students', 'cycle']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $groups = $query->latest()->paginate(10)->withQueryString();
        $advisers = User::where('tenant_id', $tenantId)->where('role', 'adviser')->get(['id', 'name']);
        $panelists = User::where('tenant_id', $tenantId)->where('role', 'panelist')->get(['id', 'name']);

        return Inertia::render('Admin/Groups/Index', [
            'groups' => $groups,
            'advisers' => $advisers,
            'panelists' => $panelists,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(ResearchGroup $group)
    {
        $group->load(['adviser', 'students', 'panelists.panelist', 'submissions.latestVersion', 'schedules', 'cycle']);
        return Inertia::render('Admin/Groups/Show', compact('group'));
    }

    public function assignAdviser(Request $request, ResearchGroup $group)
    {
        $request->validate(['adviser_id' => 'required|exists:users,id']);
        $group->update(['adviser_id' => $request->adviser_id]);
        return back()->with('success', 'Adviser assigned.');
    }

    public function assignPanelist(Request $request, ResearchGroup $group)
    {
        $request->validate(['user_id' => 'required|exists:users,id']);
        PanelistAssignment::firstOrCreate([
            'tenant_id' => $request->user()->tenant_id,
            'research_group_id' => $group->id,
            'user_id' => $request->user_id,
        ]);
        return back()->with('success', 'Panelist assigned.');
    }

    // Adviser view
    public function adviserIndex(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $groups = ResearchGroup::where('tenant_id', $tenantId)
            ->where('adviser_id', $request->user()->id)
            ->with(['students', 'cycle', 'submissions'])
            ->get();

        return Inertia::render('Adviser/Groups/Index', compact('groups'));
    }

    // Panelist view
    public function panelistIndex(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $groups = ResearchGroup::where('tenant_id', $tenantId)
            ->whereHas('panelists', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with(['students', 'adviser', 'cycle', 'submissions'])
            ->get();

        return Inertia::render('Panelist/Assignments/Index', compact('groups'));
    }

    // Student view
    public function studentGroup(Request $request)
    {
        $user = $request->user();
        $member = $user->groupMemberships()->with('group.adviser', 'group.panelists.panelist', 'group.cycle', 'group.submissions.latestVersion')->first();
        return Inertia::render('Student/Group', ['group' => $member?->group, 'memberRole' => $member?->role]);
    }

    public function createGroup(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'research_cycle_id' => 'required|exists:research_cycles,id',
        ]);

        $tenantId = $request->user()->tenant_id;
        $group = ResearchGroup::create([...$data, 'tenant_id' => $tenantId]);

        \App\Models\GroupMember::create([
            'tenant_id' => $tenantId,
            'research_group_id' => $group->id,
            'user_id' => $request->user()->id,
            'role' => 'leader',
        ]);

        return back()->with('success', 'Research group created.');
    }

    public function joinGroup(Request $request)
    {
        $request->validate(['group_code' => 'required|exists:research_groups,id']);

        \App\Models\GroupMember::create([
            'tenant_id' => $request->user()->tenant_id,
            'research_group_id' => $request->group_code,
            'user_id' => $request->user()->id,
            'role' => 'member',
        ]);

        return back()->with('success', 'Joined group successfully.');
    }
}
