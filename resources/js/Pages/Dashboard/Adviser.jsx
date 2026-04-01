import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { StatsCard } from '@/Components/StatsCard';
import { StatusBadge } from '@/Components/StatusBadge';
import { PageHeader } from '@/Components/PageHeader';
import { Users, FileCheck, CheckCircle, Calendar } from 'lucide-react';

export default function AdviserDashboard({ assignedGroups, pendingReviews, upcomingSchedules }) {
    return (
        <AuthenticatedLayout>
            <Head title="Adviser Dashboard" />
            <PageHeader title="Adviser Dashboard" subtitle="Your assigned groups and pending reviews" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatsCard label="Assigned Groups" value={assignedGroups?.length} icon={Users} color="blue" />
                <StatsCard label="Pending Reviews" value={pendingReviews?.length} icon={FileCheck} color="yellow" />
                <StatsCard label="Upcoming Schedules" value={upcomingSchedules?.length} icon={Calendar} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assigned Groups */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Assigned Groups</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {assignedGroups?.length > 0 ? assignedGroups.map(g => (
                            <div key={g.id} className="px-5 py-4 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{g.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{g.students?.length ?? 0} students · {g.cycle?.name}</p>
                                </div>
                                <StatusBadge status={g.status} />
                            </div>
                        )) : <p className="px-5 py-10 text-center text-sm text-gray-400">No assigned groups</p>}
                    </div>
                </div>

                {/* Pending Reviews */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Pending Reviews</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {pendingReviews?.length > 0 ? pendingReviews.map(s => (
                            <div key={s.id} className="px-5 py-4 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{s.group?.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{s.type?.replace(/_/g, ' ')}</p>
                                </div>
                                <StatusBadge status={s.status} />
                            </div>
                        )) : <p className="px-5 py-10 text-center text-sm text-gray-400">No pending reviews</p>}
                    </div>
                </div>

                {/* Upcoming Schedules */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden lg:col-span-2">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Schedules</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {upcomingSchedules?.length > 0 ? upcomingSchedules.map(s => (
                            <div key={s.id} className="px-5 py-4 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                    <Calendar size={16} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{s.type?.replace(/_/g, ' ')}</p>
                                    <p className="text-xs text-gray-500">{s.venue ?? 'TBD'}</p>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 flex-shrink-0">
                                    {new Date(s.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        )) : <p className="px-5 py-10 text-center text-sm text-gray-400">No upcoming schedules</p>}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
