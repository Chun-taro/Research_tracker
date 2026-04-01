import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { StatsCard } from '@/Components/StatsCard';
import { StatusBadge } from '@/Components/StatusBadge';
import { PageHeader } from '@/Components/PageHeader';
import { GraduationCap, Calendar, FileCheck } from 'lucide-react';

export default function PanelistDashboard({ assignedGroups, upcomingSchedules, pendingEvaluations }) {
    return (
        <AuthenticatedLayout>
            <Head title="Panelist Dashboard" />
            <PageHeader title="Panelist Dashboard" subtitle="Your assigned panels and evaluations" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatsCard label="Assigned Panels" value={assignedGroups?.length} icon={GraduationCap} color="blue" />
                <StatsCard label="Pending Evaluations" value={pendingEvaluations?.length} icon={FileCheck} color="yellow" />
                <StatsCard label="Upcoming Defenses" value={upcomingSchedules?.length} icon={Calendar} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Assigned Research Groups</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {assignedGroups?.length > 0 ? assignedGroups.map(g => (
                            <div key={g.id} className="px-5 py-4 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{g.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Adviser: {g.adviser?.name ?? 'TBD'}</p>
                                </div>
                                <StatusBadge status={g.status} />
                            </div>
                        )) : <p className="px-5 py-10 text-center text-sm text-gray-400">No assigned panels</p>}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Defense Schedule</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {upcomingSchedules?.length > 0 ? upcomingSchedules.map(s => (
                            <div key={s.id} className="px-5 py-4 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                                    <Calendar size={16} className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{s.type?.replace(/_/g, ' ')}</p>
                                    <p className="text-xs text-gray-500">{s.venue ?? 'TBD'}</p>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 flex-shrink-0 text-right">
                                    {new Date(s.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}<br/>
                                    <span className="text-xs text-gray-400">{new Date(s.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                </p>
                            </div>
                        )) : <p className="px-5 py-10 text-center text-sm text-gray-400">No upcoming schedules</p>}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
