import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { Search, Database, FileText, Download, Tag, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

function AddEntryModal({ groups, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        research_group_id: '',
        title: '',
        abstract: '',
        keywords: '',
        academic_year: '2025-2026',
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.repository.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Add to Repository</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Research Group</label>
                        <select 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={data.research_group_id}
                            onChange={e => setData('research_group_id', e.target.value)}
                            required
                        >
                            <option value="">Select a group...</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.title}</option>
                            ))}
                        </select>
                        {errors.research_group_id && <p className="text-xs text-red-500 mt-1">{errors.research_group_id}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Research Title</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Full title of the research"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Academic Year</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. 2025-2026"
                                value={data.academic_year}
                                onChange={e => setData('academic_year', e.target.value)}
                                required
                            />
                            {errors.academic_year && <p className="text-xs text-red-500 mt-1">{errors.academic_year}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Keywords</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Separated by commas"
                                value={data.keywords}
                                onChange={e => setData('keywords', e.target.value)}
                            />
                            {errors.keywords && <p className="text-xs text-red-500 mt-1">{errors.keywords}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Abstract</label>
                        <textarea 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="Paste the abstract here..."
                            rows="4"
                            value={data.abstract}
                            onChange={e => setData('abstract', e.target.value)}
                            required
                        ></textarea>
                        {errors.abstract && <p className="text-xs text-red-500 mt-1">{errors.abstract}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Final Manuscript (PDF)</label>
                        <input 
                            type="file" 
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={e => setData('file', e.target.files[0])}
                            required
                        />
                        {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                        >
                            {processing ? 'Uploading...' : 'Add to Repository'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function RepositoryIndex({ items, filters, groups }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [showModal, setShowModal] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Research Repository" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <PageHeader 
                    title="Research Repository" 
                    subtitle="Archive of approved and completed thesis manuscripts and studies." 
                />
                
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search topics, keywords..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {auth.user.role === 'admin' && (
                        <button 
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-sm hover:bg-blue-700 transition whitespace-nowrap"
                        >
                            <Plus size={16} /> Add Entry
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.data.length > 0 ? items.data.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden group">
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold tracking-wider uppercase">
                                    {item.academic_year}
                                </span>
                                <FileText className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 leading-tight mb-2 line-clamp-2" title={item.title}>
                                {item.title}
                            </h3>
                            <p className="text-slate-500 text-xs line-clamp-3 mb-4 flex-1">
                                {item.abstract}
                            </p>
                            
                            <div className="mt-auto">
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {item.keywords?.split(',').map((kw, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                                            <Tag size={8} strokeWidth={2.5} /> {kw.trim()}
                                        </span>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="text-xs text-slate-400 font-medium">
                                        {item.group?.students?.length || 0} Authors
                                    </div>
                                    <a 
                                        href={route('admin.repository.download', item.id)} 
                                        className="h-8 w-8 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                                        title="Download PDF"
                                    >
                                        <Download size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-white border border-slate-200 rounded-2xl border-dashed">
                        <Database size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No records found</h3>
                        <p className="text-slate-500 mt-1">The repository is currently empty for the selected filters.</p>
                    </div>
                )}
            </div>

            {showModal && <AddEntryModal groups={groups} onClose={() => setShowModal(false)} />}
        </AuthenticatedLayout>
    );
}
