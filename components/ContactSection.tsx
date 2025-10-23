
import React, { useState } from 'react';

const ContactSection: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log({ name, email, message });

        // Simulate API call
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            setName('');
            setEmail('');
            setMessage('');
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <section className="border-t border-slate-200 dark:border-slate-800 py-16 bg-slate-50 dark:bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-brand-light mb-4">
                    Get in Touch
                </h2>
                <p className="text-slate-600 dark:text-brand-medium mb-8 max-w-2xl mx-auto">
                    Have a story tip, a question, or a comment? We'd love to hear from you. Fill out the form below and a member of our team will get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md p-3 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary transition"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md p-3 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary transition"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={5}
                            className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md p-3 text-slate-900 dark:text-white focus:ring-brand-primary focus:border-brand-primary transition"
                            placeholder="Your message..."
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3 bg-brand-primary text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                            disabled={!name || !email || !message || isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ContactSection;