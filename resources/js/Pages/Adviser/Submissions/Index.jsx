import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { FileText, Eye, CheckCircle, MessageSquare, Download, Clock, User, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdviserSubmissions({ submissions }) {
    return (
        <AuthenticatedLayout>
            <Head title="Group Submissions" />
            <PageHeader title="Submissions Review" subtitle="Review and provide feedback on student research documents." />

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <tr>
                                <th className="px-8 py-5">Submissions & Group</th>
                                <th className="px-8 py-5">Document Type</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Last Activity</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {submissions.data.length > 0 ? submissions.data.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div className="max-w-xs xl:max-w-md">
                                                <p className="font-bold text-gray-900 dark:text-white truncate">{sub.group?.title}</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Research Team</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-gray-600 dark:text-gray-400 capitalize font-medium">
                                            {sub.type.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <StatusBadge status={sub.status} />
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <Clock size={14} /> {new Date(sub.updated_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/submissions/${sub.id}`} className="p-2.5 bg-gray-950 dark:bg-white text-white dark:text-gray-950 rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95">
                                                <Eye size={16} />
                                            </Link>
                                            <button className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                         <div className="max-w-sm mx-auto">
                                            <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Submissions Found</h4>
                                            <p className="text-sm text-gray-500">Your assigned groups haven't uploaded any documents for review yet.</p>
                                         </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {submissions.last_page > 1 && (
                    <div className="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page {submissions.current_page} of {submissions.last_page}</p>
                        <div className="flex gap-2">
                             {submissions.links.map((link, i) => (
                                <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${link.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 disabled:opacity-30'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                             ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
