import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { StatusBadge } from '@/Components/StatusBadge';
import { FileText, Upload, Clock, CheckCircle2, AlertCircle, MessageSquare, ChevronRight, FileDown } from 'lucide-react';
import { useState } from 'react';

export default function StudentSubmissions({ submissions, group }) {
    const [uploading, setUploading] = useState(false);
    
    const form = useForm({
        research_group_id: group?.id || '',
        type: 'title_proposal',
        file: null,
        change_notes: '',
    });

    const handleUpload = (e) => {
        e.preventDefault();
        form.post(route('student.submissions.store'), {
            onSuccess: () => {
                setUploading(false);
                form.reset();
            },
        });
    };

    if (!group) {
        return (
            <AuthenticatedLayout user={null}>
                <Head title="Submissions" />
                <PageHeader title="Submissions" subtitle="You need to be in a research group to submit documents." />
                <div className="mt-8 p-12 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Please create or join a group first.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const types = [
        { id: 'title_proposal', name: 'Title Proposal' },
        { id: 'chapter', name: 'Chapters 1-3 / 1-5' },
        { id: 'final_manuscript', name: 'Final Manuscript' },
        { id: 'defense_requirements', name: 'Defense Requirements' },
    ];

    return (
        <AuthenticatedLayout user={null}>
            <Head title="Submissions" />
            <PageHeader title="Submissions" subtitle="Upload and track your research documents"
                actions={
                    <button onClick={() => setUploading(true)} className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg">
                        <Upload size={18} /> Submit New document
                    </button>
                }
            />

            <div className="grid grid-cols-1 gap-6 mt-8">
                {submissions.length > 0 ? submissions.map((sub) => (
                    <div key={sub.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                                <FileText size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize leading-tight">
                                    {sub.type.replace(/_/g, ' ')}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                    <Clock size={12} /> Last updated: {new Date(sub.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <StatusBadge status={sub.status} />
                            
                            <div className="h-10 w-px bg-gray-100 dark:bg-gray-800 hidden md:block mx-2" />
                            
                            <div className="flex items-center gap-2">
                                <button onClick={() => router.get(`/student/submissions/${sub.id}`)} className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:text-blue-600 transition-colors">
                                    <MessageSquare size={18} />
                                </button>
                                <a href={sub.latest_version?.file_path} className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:text-blue-600 transition-colors">
                                    <FileDown size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                        <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                        <h4 className="text-gray-400 font-bold italic">No submissions yet</h4>
                        <button onClick={() => setUploading(true)} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Click here to submit your first document</button>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {uploading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">New Submission</h2>
                            <button onClick={() => setUploading(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Document Type</label>
                                <select value={form.data.type} onChange={e => form.setData('type', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                    {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Select File</label>
                                <div className="relative group">
                                    <input type="file" onChange={e => form.setData('file', e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" required />
                                    <div className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl px-8 py-10 text-center group-hover:border-blue-400 transition-colors">
                                        <div className="h-12 w-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100 dark:border-gray-800">
                                            <Upload size={20} className="text-gray-400" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                            {form.data.file ? form.data.file.name : "Drag & drop or click to upload"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX (max 50MB)</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Change Notes (Reason for submission)</label>
                                <textarea value={form.data.change_notes} onChange={e => form.setData('change_notes', e.target.value)}
                                    placeholder="Briefly describe what's in this version..." rows={3}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={form.processing} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
                                    {form.processing ? 'Uploading...' : 'Submit Document'}
                                </button>
                                <button type="button" onClick={() => setUploading(false)} className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function X({ size, className }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
}
