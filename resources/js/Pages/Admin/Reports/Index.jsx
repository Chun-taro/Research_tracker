import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { BarChart2, Download, FileText } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function ReportsIndex({ stats, statusDistribution, submissionTrends }) {
    const barRef = useRef(null);
    const barInstance = useRef(null);

    useEffect(() => {
        if (!barRef.current) return;
        const load = async () => {
            const { Chart, registerables } = await import('chart.js');
            Chart.register(...registerables);
            if (barInstance.current) barInstance.current.destroy();

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const counts = new Array(12).fill(0);
            submissionTrends?.forEach(t => { counts[t.month - 1] = t.count; });

            barInstance.current = new Chart(barRef.current, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{ label: 'Submissions', data: counts, backgroundColor: '#3B82F6', borderRadius: 6 }],
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                    plugins: { legend: { display: false } },
                },
            });
        };
        load();
        return () => barInstance.current?.destroy();
    }, [submissionTrends]);

    const statCards = [
        { label: 'Total Students', value: stats?.students, color: 'bg-blue-600' },
        { label: 'Total Advisers', value: stats?.advisers, color: 'bg-green-600' },
        { label: 'Panelists', value: stats?.panelists, color: 'bg-purple-600' },
        { label: 'Total Groups', value: stats?.total_groups, color: 'bg-gray-600' },
        { label: 'Completed', value: stats?.completed, color: 'bg-emerald-600' },
        { label: 'Ongoing', value: stats?.ongoing, color: 'bg-yellow-600' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Reports & Analytics" />
            <PageHeader
                title="Reports & Analytics"
                subtitle="Department research statistics and trends"
                actions={
                    <div className="flex gap-2">
                        <a href="/admin/reports/csv" className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Download size={15} /> CSV
                        </a>
                        <a href="/admin/reports/pdf" className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            <FileText size={15} /> PDF Report
                        </a>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {statCards.map(s => (
                    <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 text-center shadow-sm">
                        <p className={`text-2xl font-bold text-white ${s.color} rounded-lg py-2 mb-2`}>{s.value ?? 0}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart2 size={18} className="text-blue-500" /> Monthly Submission Trends
                    </h3>
                    <div className="h-60">
                        <canvas ref={barRef}></canvas>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Research Status Breakdown</h3>
                    <div className="space-y-3">
                        {Object.entries(statusDistribution ?? {}).map(([status, count]) => {
                            const total = Object.values(statusDistribution).reduce((a, b) => a + b, 0);
                            const pct = total ? Math.round((count / total) * 100) : 0;
                            const colors = { draft:'bg-gray-400', submitted:'bg-blue-500', under_review:'bg-yellow-500', revision_required:'bg-orange-500', approved:'bg-green-500', rejected:'bg-red-500', completed:'bg-purple-500' };
                            return (
                                <div key={status}>
                                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        <span className="capitalize">{status.replace(/_/g, ' ')}</span>
                                        <span>{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${colors[status] ?? 'bg-gray-400'} transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
