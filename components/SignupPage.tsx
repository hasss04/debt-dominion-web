
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await signup(name, email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign up.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl text-center">
                <h1 className="text-3xl font-bold font-serif mb-2 text-slate-900 dark:text-brand-light">Create an Account</h1>
                <p className="text-slate-600 dark:text-brand-medium mb-6">Join Debt & Dominion today.</p>
                 {error && <p className="bg-red-500/10 text-red-500 text-sm p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="John Doe"
                        />
                    </div>
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
                        disabled={isSubmitting || !name || !email || !password}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
                    Already have an account? <Link to="/login" className="font-medium text-brand-primary hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;