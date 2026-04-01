<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ResearchGroup;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        $stats = [
            'students' => User::where('tenant_id', $tenantId)->where('role', 'student')->count(),
            'advisers' => User::where('tenant_id', $tenantId)->where('role', 'adviser')->count(),
            'panelists' => User::where('tenant_id', $tenantId)->where('role', 'panelist')->count(),
            'total_groups' => ResearchGroup::where('tenant_id', $tenantId)->count(),
            'completed' => ResearchGroup::where('tenant_id', $tenantId)->where('status', 'completed')->count(),
            'ongoing' => ResearchGroup::where('tenant_id', $tenantId)->whereIn('status', ['submitted', 'under_review'])->count(),
            'approved' => ResearchGroup::where('tenant_id', $tenantId)->where('status', 'approved')->count(),
        ];

        $statusDistribution = ResearchGroup::where('tenant_id', $tenantId)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $submissionTrends = Submission::where('tenant_id', $tenantId)
            ->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, count(*) as count')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        return Inertia::render('Admin/Reports/Index', compact('stats', 'statusDistribution', 'submissionTrends'));
    }

    public function downloadPdf(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $tenant = $request->user()->tenant;

        $data = [
            'tenant' => $tenant,
            'groups' => ResearchGroup::where('tenant_id', $tenantId)->with('adviser', 'students', 'cycle')->get(),
            'stats' => [
                'students' => User::where('tenant_id', $tenantId)->where('role', 'student')->count(),
                'advisers' => User::where('tenant_id', $tenantId)->where('role', 'adviser')->count(),
                'completed' => ResearchGroup::where('tenant_id', $tenantId)->where('status', 'completed')->count(),
            ],
            'generated_at' => now()->format('F j, Y'),
        ];

        $pdf = Pdf::loadView('reports.annual', $data);
        return $pdf->download('research-report-' . now()->year . '.pdf');
    }

    public function downloadCsv(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $groups = ResearchGroup::where('tenant_id', $tenantId)->with('adviser', 'students', 'cycle')->get();

        $headers = ['Content-Type' => 'text/csv'];
        $callback = function () use ($groups) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Title', 'Status', 'Academic Year', 'Semester', 'Adviser', 'Students', 'Created At']);
            foreach ($groups as $g) {
                fputcsv($handle, [
                    $g->title,
                    $g->status,
                    $g->cycle?->academic_year,
                    $g->cycle?->semester,
                    $g->adviser?->name,
                    $g->students->pluck('name')->join(', '),
                    $g->created_at->format('Y-m-d'),
                ]);
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
