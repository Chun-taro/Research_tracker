import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-50 dark:bg-gray-950 px-4">
            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white dark:bg-gray-900 shadow-xl overflow-hidden sm:rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="group">
                        <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                            <BookOpen size={24} />
                        </div>
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">ResearchTracker</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Department Management System</p>
                </div>

                {children}

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        © {new Date().getFullYear()} ResearchTracker Academic Portal
                    </p>
                </div>
            </div>
        </div>
    );
}
