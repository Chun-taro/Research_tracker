import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { Search, Database, FileText, Download, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function RepositoryIndex({ items, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');

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
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {auth.user.role === 'admin' && (
                        <button className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-sm hover:bg-blue-700 transition whitespace-nowrap">
                            Add Entry
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
                                            <Tag size={8} /> {kw.trim()}
                                        </span>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="text-xs text-slate-400 font-medium">
                                        {item.group?.students?.length} Authors
                                    </div>
                                    <a 
                                        href={`/${auth.user.role}/repository/${item.id}/download`} 
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
        </AuthenticatedLayout>
    );
}
