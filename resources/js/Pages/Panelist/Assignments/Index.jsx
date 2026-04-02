import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { UserCheck, Eye, Users, FileText, Calendar, BookOpen, ShieldCheck, ChevronRight } from 'lucide-react';

export default function PanelistAssignments({ groups }) {
    return (
        <AuthenticatedLayout>
            <Head title="Panelist Assignments" />
            <PageHeader title="Panelist Assignments" subtitle={`${groups.length} research groups assigned for your evaluation.`} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
                {groups && groups.length > 0 ? groups.map((group) => (
                    <div key={group.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

                        <div className="flex justify-between items-start mb-6">
                            <StatusBadge status={group.status} />
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-lg">
                                <BookOpen size={14} className="text-purple-500" /> {group.cycle?.name}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4 leading-tight group-hover:text-purple-600 transition-colors">
                            {group.title}
                        </h3>
                        
                        <p className="text-xs text-gray-500 italic mb-8 line-clamp-2 leading-relaxed">
                            {group.abstract || "Abstract pending update. Please consult with the group leader or adviser for more details on this research project."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="h-10 w-10 bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="truncate">
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Group Adviser</p>
                                     <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{group.adviser?.name ?? 'Not Assigned'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="h-10 w-10 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                                    <Users size={20} />
                                </div>
                                <div>
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Team Size</p>
                                     <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{group.students?.length ?? 0} Students</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto flex items-center gap-4">
                            <Link href={`/admin/groups/${group.id}`} className="flex-1 py-4 bg-gray-950 dark:bg-white text-white dark:text-gray-950 rounded-2xl text-sm font-black uppercase tracking-widest text-center hover:opacity-90 transition-all shadow-xl active:scale-[0.98]">
                                Review Repository
                            </Link>
                            <div className="h-14 w-14 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all cursor-pointer group">
                                <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-24 text-center bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center group overflow-hidden relative">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
                         <div className="h-24 w-24 bg-purple-50 dark:bg-purple-900/10 text-purple-200 dark:text-purple-800 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-700">
                            <UserCheck size={48} />
                         </div>
                         <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Active Assignments</h4>
                         <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
                            You're not currently assigned to any research panel. Department administrators will notify you once a group is assigned for your review.
                         </p>
                         <div className="mt-10 px-8 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Assignment Dashboard</p>
                         </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
