import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, Mail, ArrowLeft } from 'lucide-react';

export default function Inactive({ message, type = 'tenant' }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
            <Head title="Account Status" />
            
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12">
                <div className="mx-auto w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 animate-pulse">
                    <ShieldAlert size={40} />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {type === 'tenant' ? 'Department Access Suspended' : 'Account Deactivated'}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    {message || "This department space is currently inactive. This usually happens when a subscription expires or the institution has restricted access."}
                </p>
                
                <div className="space-y-3">
                    <a href="mailto:support@researchtracker.edu" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20">
                        <Mail size={18} /> Contact Support
                    </a>
                    
                    <Link href="/" className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-all">
                        <ArrowLeft size={18} /> Go Back Home
                    </Link>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Powered By</p>
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic">
                        Research Tracker Central
                    </div>
                </div>
            </div>
            
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-600">
                &copy; 2026 Research Management Systems. All rights reserved.
            </p>
        </div>
    );
}
