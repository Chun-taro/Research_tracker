import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { Users, Eye, FileText, Calendar, ChevronRight, MessageSquare, BookOpen } from 'lucide-react';

export default function AdviserGroups({ groups }) {
    return (
        <AuthenticatedLayout>
            <Head title="Adviser Dashboard" />
            <PageHeader title="Assigned Groups" subtitle={`${groups.length} active research groups under your supervision.`} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                {groups && groups.length > 0 ? groups.map((group) => (
                    <div key={group.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-full w-2 flex flex-col">
                            <div className="h-1/2 bg-blue-500"></div>
                            <div className="h-1/2 bg-indigo-600"></div>
                        </div>
                        
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <StatusBadge status={group.status} />
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                    <BookOpen size={14} className="text-blue-500" /> {group.cycle?.name}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                                {group.title}
                            </h3>

                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Students</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{group.students?.length ?? 0} Members</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Submissions</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{group.submissions?.length ?? 0} Documents</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Academic Year</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{group.cycle?.academic_year}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-3">
                                <Link
                                    href={`/admin/groups/${group.id}`}
                                    className="flex-1 py-3 px-4 bg-gray-950 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
                                >
                                    <Eye size={18} /> Manage Group
                                </Link>
                                <Link
                                    href={`/adviser/submissions?group_id=${group.id}`}
                                    className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-950 dark:text-white rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 transition-all"
                                >
                                    <MessageSquare size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                         <Users size={64} className="mx-auto text-gray-100 dark:text-gray-800 mb-6" />
                         <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Groups Assigned</h4>
                         <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm">
                            You're not currently listed as an adviser for any research groups. Once the department admin assigns you, they will appear here.
                         </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
