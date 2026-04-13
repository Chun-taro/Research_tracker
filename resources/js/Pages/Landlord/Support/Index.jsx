import React, { useState } from 'react';
import LandlordLayout from '@/Layouts/LandlordLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    LifeBuoy, MessageSquare, AlertCircle, 
    CheckCircle2, Clock, ShieldAlert, Building2, 
    User, ChevronRight, Save, X, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Index({ tickets }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const { data, setData, patch, processing, reset, errors } = useForm({
        status: '',
        admin_notes: '',
    });

    const openEdit = (ticket) => {
        setSelectedTicket(ticket);
        setData({
            status: ticket.status,
            admin_notes: ticket.admin_notes || '',
        });
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('landlord.tickets.update', selectedTicket.id), {
            onSuccess: () => {
                setSelectedTicket(null);
                reset();
            },
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-500 text-white';
            case 'in_progress': return 'bg-amber-500 text-white';
            case 'resolved': return 'bg-emerald-500 text-white';
            case 'closed': return 'bg-slate-500 text-white';
            default: return 'bg-slate-400 text-white';
        }
    };

    return (
        <LandlordLayout>
            <Head title="Landlord - Support Tickets" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <LifeBuoy className="text-indigo-600 h-6 w-6" />
                            Global Support Tickets
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Monitor and respond to bug reports and feature requests from all institutional tenants.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Reports:</span>
                        <span className="bg-slate-950 text-white px-3 py-1 rounded-full text-xs font-black">{tickets.total}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    {/* Tickets List */}
                    <div className="xl:col-span-2 space-y-4">
                        {tickets.data.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-slate-200">
                                <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">No tickets found</h3>
                                <p className="text-slate-500 mt-1">When tenants report issues, they will appear here.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Ticket</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tenant & User</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Priority</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {tickets.data.map((ticket) => (
                                                <tr 
                                                    key={ticket.id} 
                                                    className={cn(
                                                        "hover:bg-slate-50/50 transition-colors group",
                                                        selectedTicket?.id === ticket.id && "bg-indigo-50/30"
                                                    )}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-[200px]">
                                                            <p className="text-sm font-bold text-slate-900 truncate leading-tight">{ticket.subject}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">#{ticket.id} • {ticket.type}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                                                <Building2 size={12} className="text-slate-400" />
                                                                {ticket.tenant?.name || 'Central'}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mt-1">
                                                                <User size={10} />
                                                                {ticket.user?.name}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-tighter",
                                                            ticket.priority === 'critical' ? 'text-red-500' :
                                                            ticket.priority === 'high' ? 'text-orange-500' :
                                                            'text-slate-400'
                                                        )}>
                                                            {ticket.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none",
                                                            getStatusStyles(ticket.status)
                                                        )}>
                                                            {ticket.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => openEdit(ticket)}
                                                            className="text-indigo-600 hover:text-indigo-900 font-black text-[10px] uppercase tracking-widest p-2 rounded hover:bg-slate-100 transition-all"
                                                        >
                                                            Manage
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Manage Panel */}
                    <div className="xl:sticky xl:top-[6rem]">
                        {selectedTicket ? (
                            <div className="bg-slate-950 text-white rounded-xl shadow-2xl overflow-hidden border border-slate-800 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em]">Ticket Management</h2>
                                    <button onClick={() => setSelectedTicket(null)} className="text-slate-500 hover:text-white transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Info */}
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Description</p>
                                            <p className="text-xs text-slate-300 leading-relaxed max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                                {selectedTicket.description}
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={submit} className="space-y-4 pt-4 border-t border-slate-800">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Update Status</label>
                                            <select 
                                                className="w-full bg-slate-900 border-slate-800 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                            >
                                                <option value="open">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed / Invalid</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Resolution Notes</label>
                                            <textarea 
                                                rows="5"
                                                placeholder="Explain the fix or request more info..."
                                                className="w-full bg-slate-900 border-slate-800 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 resize-none"
                                                value={data.admin_notes}
                                                onChange={e => setData('admin_notes', e.target.value)}
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            {processing ? 'Saving...' : <><Save size={14} /> Update Ticket</>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center h-[400px] flex flex-col items-center justify-center">
                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                    <ChevronRight className="text-slate-300" size={32} />
                                </div>
                                <h3 className="text-slate-400 font-bold text-sm">Select a ticket to manage</h3>
                                <p className="text-slate-400 text-xs mt-1">Updates will be visible to the tenant immediately.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LandlordLayout>
    );
}
