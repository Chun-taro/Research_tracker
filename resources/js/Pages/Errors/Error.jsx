import { Head, Link } from '@inertiajs/react';
import { Home, ArrowLeft, Search, AlertCircle, FileQuestion, ShieldAlert } from 'lucide-react';

export default function Error({ status, message }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status];

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status];

    const Icon = {
        503: AlertCircle,
        500: AlertCircle,
        404: FileQuestion,
        403: ShieldAlert,
    }[status] || AlertCircle;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
            <Head title={title} />
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* 404 Illustration Area */}
                <div className="relative inline-block">
                    <div className="text-[12rem] font-black text-gray-200 dark:text-gray-800/30 leading-none select-none">
                        {status}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-24 w-24 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800 animate-bounce duration-1000">
                            <Icon size={48} className="text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        {title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
                        {message || description}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group"
                    >
                        <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                        Return Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

                <div className="pt-12">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Research Tracker &bull; Central Identity Hub
                    </p>
                </div>
            </div>
        </div>
    );
}
