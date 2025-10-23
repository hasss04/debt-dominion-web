
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, signInWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to log in.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (err: any) {
             setError(err.message || 'Failed to sign in with Google.');
        } finally {
             setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl text-center">
                <h1 className="text-3xl font-bold font-serif mb-2 text-slate-900 dark:text-brand-light">Welcome Back</h1>
                <p className="text-slate-600 dark:text-brand-medium mb-6">Log in to continue to Debt & Dominion.</p>
                {error && <p className="bg-red-500/10 text-red-500 text-sm p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="••••••••"
                        />
                    </div>
                     <button
                        type="submit"
                        className="w-full px-6 py-3 bg-brand-primary text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:bg-slate-500"
                        disabled={isSubmitting || !email || !password}
                    >
                        {isSubmitting ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                 <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                    <span className="mx-4 text-sm text-slate-500 dark:text-slate-400">OR</span>
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <button
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white font-bold rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:bg-slate-200 dark:disabled:bg-slate-500"
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.61-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Continue with Google
                </button>
                <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account? <Link to="/signup" className="font-medium text-brand-primary hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;