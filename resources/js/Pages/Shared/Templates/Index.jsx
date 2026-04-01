import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { FileText, Download, Trash2, Folder, File, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function TemplatesIndex({ templates }) {
    const { auth } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'All Templates' },
        { id: 'title_proposal', label: 'Title Proposals' },
        { id: 'chapter_format', label: 'Chapter Formats' },
        { id: 'defense_form', label: 'Defense Forms' },
        { id: 'manuscript_format', label: 'Manuscript Formats' },
        { id: 'other', label: 'Other Documents' },
    ];

    const filteredTemplates = selectedCategory === 'all' 
        ? templates 
        : templates.filter(t => t.category === selectedCategory);

    return (
        <AuthenticatedLayout>
            <Head title="Document Templates" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <PageHeader 
                    title="Document Templates" 
                    subtitle="Download official forms, formats, and guides for your research." 
                />
                
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    {auth.user.role === 'admin' && (
                        <button className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-sm hover:bg-blue-700 transition whitespace-nowrap">
                            Upload Template
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.length > 0 ? filteredTemplates.map((template) => (
                    <div key={template.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group">
                        <div className="p-5 flex gap-4 items-start">
                            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 leading-tight mb-1 truncate" title={template.name}>
                                    {template.name}
                                </h3>
                                <p className="text-xs text-slate-500 capitalize mb-2">
                                    {template.category.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                        
                        <div className="px-5 pb-5 flex-1">
                            <p className="text-sm text-slate-600 line-clamp-2" title={template.description}>
                                {template.description || "No description provided."}
                            </p>
                        </div>

                        <div className="bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-between">
                            <div className="flex flex-col text-[10px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1"><File size={10} /> {template.file_name}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {auth.user.role === 'admin' && (
                                    <button className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <a 
                                    href={`/${auth.user.role}/templates/${template.id}/download`} 
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                                    title="Download Template"
                                >
                                    <Download size={14} /> Get
                                </a>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-white border border-slate-200 rounded-2xl border-dashed">
                        <Folder size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No templates found</h3>
                        <p className="text-slate-500 mt-1">There are no document templates available in this category.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
