import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { StatsCard } from '@/Components/StatsCard';
import { StatusBadge } from '@/Components/StatusBadge';
import { PageHeader } from '@/Components/PageHeader';
import { FileText, CheckCircle, Calendar, Clock } from 'lucide-react';

export default function StudentDashboard({ group, groupMember, recentSubmissions, upcomingSchedules }) {
    const submittedCount = recentSubmissions?.filter(s => s.status === 'submitted').length ?? 0;
    const approvedCount = recentSubmissions?.filter(s => s.status === 'approved').length ?? 0;

    return (
        <AuthenticatedLayout>
            <Head title="Student Dashboard" />
            <PageHeader title="Student Dashboard" subtitle="Track your research progress" />

            {!group ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-10 text-center shadow-sm">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <FileText size={28} className="text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Research Group Yet</h3>
                    <p className="text-sm text-gray-500 mb-6">Create or join a research group to get started.</p>
                    <Link
                        href="/student/group"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            ) : (
                <>
                    {/* Research group info */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white mb-6 shadow-sm">
                        <p className="text-blue-200 text-sm mb-1">Current Research</p>
                        <h2 className="text-xl font-bold mb-3 leading-tight">{group.title}</h2>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div><span className="text-blue-200">Role:</span> <span className="font-medium capitalize">{groupMember?.role}</span></div>
                            <div><span className="text-blue-200">Adviser:</span> <span className="font-medium">{group.adviser?.name ?? 'Not yet assigned'}</span></div>
                            <div><span className="text-blue-200">Cycle:</span> <span className="font-medium">{group.cycle?.name ?? '—'}</span></div>
                            <StatusBadge status={group.status} className="ml-auto" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <StatsCard label="Submitted Documents" value={submittedCount} icon={FileText} color="blue" />
                        <StatsCard label="Approved Documents" value={approvedCount} icon={CheckCircle} color="green" />
                        <StatsCard label="Upcoming Schedules" value={upcomingSchedules?.length} icon={Calendar} color="purple" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Submissions */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Submission Status</h3>
                                <Link href="/student/submissions" className="text-xs text-blue-600 hover:underline">View all</Link>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {recentSubmissions?.length > 0 ? recentSubmissions.map(s => (
                                    <div key={s.id} className="px-5 py-4 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{s.type?.replace(/_/g, ' ')}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {s.latest_version ? `v${s.latest_version.version} · ${s.latest_version.file_name}` : 'No file yet'}
                                            </p>
                                        </div>
                                        <StatusBadge status={s.status} />
                                    </div>
                                )) : <p className="px-5 py-10 text-center text-sm text-gray-400">No submissions yet</p>}
                            </div>
                        </div>

                        {/* Upcoming Schedules */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Schedules</h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {upcomingSchedules?.length > 0 ? upcomingSchedules.map(s => (
                                    <div key={s.id} className="px-5 py-4 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                            <Clock size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{s.type?.replace(/_/g, ' ')}</p>
                                            <p className="text-xs text-gray-500">{new Date(s.scheduled_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )) : <p className="px-5 py-10 text-center text-sm text-gray-400">No upcoming schedules</p>}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AuthenticatedLayout>
    );
}
