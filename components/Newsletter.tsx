
import React, { useState } from 'react';

const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            console.log(`Subscribed with email: ${email}`);
            setIsSubmitting(false);
            setIsSuccess(true);
            setEmail('');
        }, 1500);
    };

    if (isSuccess) {
        return (
            <section className="bg-green-50 dark:bg-green-900/20 py-16 rounded-lg text-center border border-green-200 dark:border-green-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                    <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h2 className="text-3xl font-bold font-serif mb-2 text-green-900 dark:text-green-200">Subscription Confirmed!</h2>
                    <p className="text-green-700 dark:text-green-300">Thank you for subscribing to the Debt & Dominion newsletter. You'll be the first to know about our latest articles.</p>
                </div>
            </section>
        );
    }


    return (
        <section className="bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-brand-light mb-4">
                    Subscribe to Our Newsletter
                </h2>
                <p className="text-slate-600 dark:text-brand-medium mb-8 max-w-2xl mx-auto">
                    Stay ahead of the curve. Get the latest insights on finance, power, and geopolitics delivered straight to your inbox.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        aria-label="Email address"
                        required
                        className="flex-grow w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-brand-primary text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>
        </section>
    );
};

export default Newsletter;