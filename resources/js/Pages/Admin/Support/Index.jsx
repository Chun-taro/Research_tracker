import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    LifeBuoy, Send, MessageSquare, AlertCircle, 
    CheckCircle2, Clock, ShieldAlert, ChevronRight, 
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Index({ tickets }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        subject: '',
        description: '',
        type: 'bug',
        priority: 'medium',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('support.store'), {
            onSuccess: () => {
                reset();
                setIsSubmitting(false);
            },
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
            case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
            case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
            case 'closed': return 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800/50';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'critical': return 'text-red-600 dark:text-red-400';
            case 'high': return 'text-orange-600 dark:text-orange-400';
            case 'medium': return 'text-blue-600 dark:text-blue-400';
            case 'low': return 'text-gray-600 dark:text-gray-400';
            default: return 'text-gray-600';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Support & Bug Reporting" />

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <LifeBuoy className="text-blue-600 dark:text-blue-400 h-8 w-8" />
                            Support & Bug Reporting
                        </h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
                            Report issues or request system improvements directly to the Landlord team.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsSubmitting(!isSubmitting)}
                        className={cn(
                            "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg",
                            isSubmitting 
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-none"
                        )}
                    >
                        {isSubmitting ? (
                            <>View History</>
                        ) : (
                            <><Plus size={18} /> New Ticket</>
                        )}
                    </button>
                </div>

                {isSubmitting ? (
                    /* Submission Form */
                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl overflow-hidden p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Issue Subject</label>
                                    <input
                                        type="text"
                                        placeholder="Brief title of the problem"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        required
                                    />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Type</label>
                                        <select
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none"
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                        >
                                            <option value="bug">Bug Report</option>
                                            <option value="feature_request">Feature Request</option>
                                            <option value="support">General Support</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Priority</label>
                                        <select
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none"
                                            value={data.priority}
                                            onChange={e => setData('priority', e.target.value)}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Detailed Description</label>
                                <textarea
                                    rows="6"
                                    placeholder="Explain the issue in detail. If it's a bug, list the steps to reproduce it."
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 dark:text-white transition-all resize-none"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-200 dark:shadow-none"
                                >
                                    {processing ? 'Submitting...' : <><Send size={18} /> Submit Report</>}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Tickets List */
                    <div className="space-y-4">
                        {tickets.length === 0 ? (
                            <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-800">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-none">No support tickets found</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Submit your first report to start communicating with the system administrators.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {tickets.map((ticket) => (
                                    <div 
                                        key={ticket.id}
                                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 p-6 flex flex-col md:flex-row gap-6 relative group overflow-hidden"
                                    >
                                        {/* Status Sidebar indicator */}
                                        <div className={cn(
                                            "absolute left-0 top-0 bottom-0 w-1.5",
                                            ticket.status === 'resolved' ? 'bg-emerald-500' : 
                                            ticket.status === 'in_progress' ? 'bg-amber-500' : 
                                            'bg-blue-500'
                                        )} />

                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                            getStatusStyles(ticket.status)
                                                        )}>
                                                            {ticket.status.replace('_', ' ')}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">
                                                            #{ticket.id} • {ticket.type.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                                        {ticket.subject}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-tight text-gray-400">
                                                        <Clock size={12} />
                                                        {new Date(ticket.created_at).toLocaleDateString()}
                                                    </div>
                                                    <div className={cn("text-[11px] font-black uppercase tracking-tighter mt-1", getPriorityStyles(ticket.priority))}>
                                                        {ticket.priority} Priority
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {ticket.description}
                                                </p>
                                            </div>

                                            {ticket.admin_notes && (
                                                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
                                                    <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400">
                                                        <ShieldAlert size={16} />
                                                        <span className="text-xs font-black uppercase tracking-widest">Administrator Reply</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                                        "{ticket.admin_notes}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
