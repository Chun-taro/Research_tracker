import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, RefreshCw, X, MessageSquare } from 'lucide-react';
import { Link } from '@inertiajs/react';

function ReviewModal({ submission, action, onClose }) {
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);

    const urls = {
        approve: `/admin/submissions/${submission.id}/approve`,
        reject: `/admin/submissions/${submission.id}/reject`,
        revision: `/admin/submissions/${submission.id}/request-revision`,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post(urls[action], { remarks }, { onFinish: () => { setProcessing(false); onClose(); } });
    };

    const titles = { approve: 'Approve Submission', reject: 'Reject Submission', revision: 'Request Revision' };
    const colors = { approve: 'bg-green-600 hover:bg-green-700', reject: 'bg-red-600 hover:bg-red-700', revision: 'bg-yellow-600 hover:bg-yellow-700' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{titles[action]}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Remarks {action !== 'approve' ? '(required)' : '(optional)'}
                        </label>
                        <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={4} required={action !== 'approve'}
                            placeholder="Enter your remarks or feedback..."
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={processing} className={`px-4 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors ${colors[action]}`}>
                            {processing ? 'Saving...' : titles[action]}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function SubmissionsIndex({ submissions, filters }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [reviewModal, setReviewModal] = useState(null);

    const statuses = ['', 'submitted', 'under_review', 'revision_required', 'approved', 'rejected'];

    return (
        <AuthenticatedLayout>
            <Head title="Submissions" />
            <PageHeader title="Submissions" subtitle="Review and manage document submissions" />

            <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
                {statuses.map(s => (
                    <button key={s} onClick={() => { setStatus(s); router.get('/admin/submissions', { status: s }, { preserveState: true }); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${status === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50'}`}>
                        {s ? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'All'}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                                {['Research Group', 'Type', 'File', 'Status', 'Reviewed By', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {submissions?.data?.length > 0 ? submissions.data.map(sub => (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white max-w-xs">
                                        <p className="truncate">{sub.group?.title ?? '—'}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 capitalize">
                                        {sub.type?.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500 text-xs max-w-xs truncate">
                                        {sub.latest_version?.file_name ?? '—'}
                                    </td>
                                    <td className="px-5 py-3.5"><StatusBadge status={sub.status} /></td>
                                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{sub.reviewer?.name ?? '—'}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            {sub.status === 'submitted' && (
                                                <>
                                                    <button onClick={() => setReviewModal({ sub, action: 'approve' })} className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Approve"><CheckCircle size={15} /></button>
                                                    <button onClick={() => setReviewModal({ sub, action: 'revision' })} className="p-1.5 rounded-md text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors" title="Request Revision"><RefreshCw size={15} /></button>
                                                    <button onClick={() => setReviewModal({ sub, action: 'reject' })} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Reject"><XCircle size={15} /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No submissions found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {reviewModal && (
                <ReviewModal submission={reviewModal.sub} action={reviewModal.action} onClose={() => setReviewModal(null)} />
            )}
        </AuthenticatedLayout>
    );
}
