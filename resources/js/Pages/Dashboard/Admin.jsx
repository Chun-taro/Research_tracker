import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { StatsCard } from '@/Components/StatsCard';
import { StatusBadge } from '@/Components/StatusBadge';
import { PageHeader } from '@/Components/PageHeader';
import { Users, GraduationCap, UserCheck, BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function AdminDashboard({ stats, statusDistribution, upcomingDeadlines, recentGroups }) {
    const { tenant } = usePage().props;
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const loadChart = async () => {
            const { Chart, registerables } = await import('chart.js');
            Chart.register(...registerables);
            if (chartInstance.current) chartInstance.current.destroy();

            const labels = Object.keys(statusDistribution ?? {});
            const values = Object.values(statusDistribution ?? {});
            const colors = {
                draft:'#6B7280', submitted:'#3B82F6', under_review:'#F59E0B',
                revision_required:'#F97316', approved:'#10B981', rejected:'#EF4444', completed:'#8B5CF6'
            };

            chartInstance.current = new Chart(chartRef.current, {
                type: 'doughnut',
                data: {
                    labels: labels.map(l => l.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())),
                    datasets: [{ data: values, backgroundColor: labels.map(l => colors[l] ?? '#6B7280'), borderWidth: 0 }],
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { padding: 12, boxWidth: 12 } } },
                    cutout: '68%',
                },
            });
        };
        loadChart();
        return () => chartInstance.current?.destroy();
    }, [statusDistribution]);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <PageHeader
                title={`${tenant?.name ?? 'Department'} Dashboard`}
                subtitle="Overview of research activities"
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatsCard label="Total Students" value={stats?.total_students} icon={Users} color="blue" />
                <StatsCard label="Total Advisers" value={stats?.total_advisers} icon={UserCheck} color="green" />
                <StatsCard label="Total Panelists" value={stats?.total_panelists} icon={GraduationCap} color="purple" />
                <StatsCard label="Ongoing Research" value={stats?.ongoing_research} icon={BookOpen} color="yellow" />
                <StatsCard label="Approved Research" value={stats?.approved_research} icon={CheckCircle} color="green" />
                <StatsCard label="Pending Submissions" value={stats?.pending_submissions} icon={Clock} color="indigo" />
                <StatsCard label="Completed Research" value={stats?.completed_research} icon={CheckCircle} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Research Status Distribution</h3>
                    <div className="h-56">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        <AlertCircle className="inline mr-2 text-yellow-500" size={16} />
                        Upcoming Deadlines
                    </h3>
                    {upcomingDeadlines ? (
                        <div className="space-y-3">
                            {[
                                { label: 'Proposal', date: upcomingDeadlines.proposal_deadline },
                                { label: 'Chapter', date: upcomingDeadlines.chapter_deadline },
                                { label: 'Final Manuscript', date: upcomingDeadlines.final_deadline },
                                { label: 'Defense', date: upcomingDeadlines.defense_deadline },
                            ].filter(d => d.date).map(d => (
                                <div key={d.label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{d.label}</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{new Date(d.date).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No active research cycle</p>
                    )}
                </div>

                {/* Quick actions */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 shadow-sm text-white">
                    <h3 className="font-semibold mb-4">Quick Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-blue-200">Completion Rate</span>
                            <span className="font-bold">{stats?.total_groups ? Math.round((stats.completed_research / (stats.total_groups || 1)) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-blue-700 rounded-full h-2 mt-1">
                            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${stats?.total_groups ? Math.round((stats?.completed_research / (stats?.total_groups || 1)) * 100) : 0}%` }} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                        <span className="text-blue-200 text-[10px] uppercase font-bold tracking-wider">Subscription Plan</span>
                        <StatusBadge status={tenant?.subscription_tier} />
                    </div>
                </div>
            </div>

            {/* Recent Groups Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Recent Research Groups</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Adviser</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cycle</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {recentGroups?.length > 0 ? recentGroups.map(group => (
                                <tr key={group.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white max-w-xs truncate">{group.title}</td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{group.adviser?.name ?? '—'}</td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{group.cycle?.name ?? '—'}</td>
                                    <td className="px-5 py-3.5"><StatusBadge status={group.status} /></td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">No research groups yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
