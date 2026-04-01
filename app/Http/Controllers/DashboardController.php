<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\ResearchGroup;
use App\Models\Submission;
use App\Models\Schedule;
use App\Models\ResearchCycle;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        return match ($user->role) {
            'admin' => $this->adminDashboard($user, $tenantId),
            'adviser' => $this->adviserDashboard($user, $tenantId),
            'panelist' => $this->panelistDashboard($user, $tenantId),
            'student' => $this->studentDashboard($user, $tenantId),
            'superadmin' => redirect()->route('landlord.dashboard'),
            default => abort(403),
        };
    }

    private function adminDashboard($user, $tenantId)
    {
        $stats = [
            'total_students' => User::where('tenant_id', $tenantId)->where('role', 'student')->count(),
            'total_advisers' => User::where('tenant_id', $tenantId)->where('role', 'adviser')->count(),
            'total_panelists' => User::where('tenant_id', $tenantId)->where('role', 'panelist')->count(),
            'ongoing_research' => ResearchGroup::where('tenant_id', $tenantId)->whereIn('status', ['submitted', 'under_review', 'revision_required'])->count(),
            'approved_research' => ResearchGroup::where('tenant_id', $tenantId)->where('status', 'approved')->count(),
            'pending_submissions' => Submission::where('tenant_id', $tenantId)->where('status', 'submitted')->count(),
            'completed_research' => ResearchGroup::where('tenant_id', $tenantId)->where('status', 'completed')->count(),
        ];

        $statusDistribution = ResearchGroup::where('tenant_id', $tenantId)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->status => $row->count]);

        $upcomingDeadlines = ResearchCycle::where('tenant_id', $tenantId)
            ->where('status', 'active')
            ->orderBy('proposal_deadline')
            ->first();

        $recentGroups = ResearchGroup::where('tenant_id', $tenantId)
            ->with(['adviser', 'cycle'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Dashboard/Admin', compact('stats', 'statusDistribution', 'upcomingDeadlines', 'recentGroups'));
    }

    private function adviserDashboard($user, $tenantId)
    {
        $assignedGroups = ResearchGroup::where('tenant_id', $tenantId)
            ->where('adviser_id', $user->id)
            ->with(['students', 'cycle'])
            ->get();

        $pendingReviews = Submission::where('tenant_id', $tenantId)
            ->whereHas('group', fn ($q) => $q->where('adviser_id', $user->id))
            ->where('status', 'submitted')
            ->with('group')
            ->get();

        $upcomingSchedules = Schedule::where('tenant_id', $tenantId)
            ->whereHas('group', fn ($q) => $q->where('adviser_id', $user->id))
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Adviser', compact('assignedGroups', 'pendingReviews', 'upcomingSchedules'));
    }

    private function panelistDashboard($user, $tenantId)
    {
        $assignedGroups = ResearchGroup::where('tenant_id', $tenantId)
            ->whereHas('panelists', fn ($q) => $q->where('user_id', $user->id))
            ->with(['students', 'adviser', 'cycle'])
            ->get();

        $upcomingSchedules = Schedule::where('tenant_id', $tenantId)
            ->whereHas('group.panelists', fn ($q) => $q->where('user_id', $user->id))
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        $pendingEvaluations = Submission::where('tenant_id', $tenantId)
            ->whereHas('group.panelists', fn ($q) => $q->where('user_id', $user->id))
            ->where('status', 'under_review')
            ->with('group')
            ->get();

        return Inertia::render('Dashboard/Panelist', compact('assignedGroups', 'upcomingSchedules', 'pendingEvaluations'));
    }

    private function studentDashboard($user, $tenantId)
    {
        $groupMember = $user->groupMemberships()->with('group.adviser', 'group.cycle')->first();
        $group = $groupMember?->group;

        $recentSubmissions = $group
            ? Submission::where('tenant_id', $tenantId)->where('research_group_id', $group->id)->with('latestVersion')->latest()->take(5)->get()
            : collect();

        $upcomingSchedules = $group
            ? Schedule::where('tenant_id', $tenantId)->where('research_group_id', $group->id)->where('scheduled_at', '>', now())->orderBy('scheduled_at')->take(3)->get()
            : collect();

        return Inertia::render('Dashboard/Student', compact('group', 'groupMember', 'recentSubmissions', 'upcomingSchedules'));
    }
}
