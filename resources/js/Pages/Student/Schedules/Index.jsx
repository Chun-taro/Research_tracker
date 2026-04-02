import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageHeader } from '@/Components/PageHeader';
import { Calendar, Clock, MapPin, Users, AlertCircle, Info, ChevronRight } from 'lucide-react';

export default function StudentSchedules({ schedules, group }) {
    if (!group) {
        return (
            <AuthenticatedLayout>
                <Head title="Schedules" />
                <PageHeader title="Defense Schedules" subtitle="You need to be in a research group to see your schedules." />
                <div className="mt-8 p-12 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Please create or join a group first.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="My Schedules" />
            <PageHeader title="Group Schedules" subtitle={`Upcoming defense and consultation dates for ${group.title}`} />

            <div className="mt-8 space-y-6">
                {schedules && schedules.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {schedules.map((schedule) => (
                            <div key={schedule.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow group">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-800/30">
                                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                                            {new Date(schedule.scheduled_at).toLocaleString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="text-xl font-black">
                                            {new Date(schedule.scheduled_at).getDate()}
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="px-2 py-0.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded">
                                                {schedule.type.replace('_', ' ')}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                                                schedule.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : 
                                                schedule.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {schedule.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                                            {schedule.type === 'consultation' ? 'Adviser Consultation' : 'Research Defense Session'}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(schedule.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {schedule.venue || 'TBA'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pl-6 md:pl-0 border-l border-gray-100 dark:border-gray-800 md:border-none">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Adviser</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{group.adviser?.name ?? 'Assigned soon'}</p>
                                    </div>
                                    <div className="h-10 w-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-12 text-center group">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
                         <Calendar size={64} className="mx-auto text-gray-100 dark:text-gray-800 mb-6 group-hover:scale-110 transition-transform duration-500" />
                         <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Scheduled Sessions</h4>
                         <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
                            Your adviser or department admin hasn't scheduled any defense or consultation sessions for your group yet.
                         </p>
                         <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold">
                            <Info size={14} /> Check back later for updates
                         </div>
                    </div>
                )}
            </div>

             {/* Guidance box */}
             <div className="mt-12 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl p-8 flex gap-6 items-start">
                <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="text-amber-900 dark:text-amber-400 font-bold mb-1">Defense Preparation</h4>
                    <p className="text-amber-800/70 dark:text-amber-400/60 text-sm leading-relaxed">
                        Ensure all your required documents are uploaded to the <span className="font-bold underline decoration-amber-200">Submissions</span> tab at least 3 days before your scheduled defense. Contact your adviser if you need to reschedule or change the venue.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
