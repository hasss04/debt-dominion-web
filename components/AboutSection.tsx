
import React from 'react';

const AboutSection: React.FC = () => {
    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="mb-12">
                     <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-400 text-transparent bg-clip-text">
                        About Our Publication: Analysing Financial Systems and International Relations
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Left Column - Text */}
                    <div className="lg:col-span-3 space-y-6 text-slate-600 dark:text-brand-medium text-base md:text-lg leading-relaxed">
                        <p>
                            Founded in 2025 by Vedika Joshi and her team at <em className="font-serif italic text-slate-800 dark:text-slate-200">Debt & Dominion</em>. This Publication is an international publication dedicated to exploring the dynamic intersections of <strong className="font-semibold text-slate-900 dark:text-brand-light">economics, geopolitics, and global governance</strong>. Born in a time of rising uncertainty and fractured institutions, the magazine was created to give emerging voices a seat at the table—where power is negotiated, and policy is made.
                        </p>
                        <p>
                            We offer a new kind of analysis: one that doesn’t just report on global affairs, but interrogates the systems behind them. From sovereign debt to sanctions, development diplomacy to energy economics, each issue uncovers how financial tools shape political decisions—and vice versa.
                        </p>
                        <p>
                            What sets <em className="font-serif italic text-slate-800 dark:text-slate-200">Debt & Dominion</em> apart is our unique editorial structure: we are <strong className="font-semibold text-slate-900 dark:text-brand-light">powered entirely by students</strong>, yet guided by the same rigour expected in policy circles and professional journalism. Our contributors include aspiring economists, diplomats, and scholars from leading global institutions—united by a shared desire to challenge surface-level narratives and produce writing that matters.
                        </p>
                        <p>
                            Published bimonthly, our magazine features <strong className="font-semibold text-slate-900 dark:text-brand-light">deeply researched, visually bold, and thematically sharp</strong> content that aims to inform, provoke, and elevate. Whether it's analysing central bank influence, dissecting global trade deals, or mapping the political consequences of inflation, we write to make sense of the systems that shape our world.
                        </p>
                         <p className="font-semibold text-slate-800 dark:text-slate-300">
                            We don’t just follow the headlines. We explain what makes them possible.
                        </p>
                    </div>

                    {/* Right Column - Image and List */}
                    <div className="lg:col-span-2 space-y-8">
                        <img 
                            src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop" 
                            alt="Stack of economics and politics books" 
                            className="rounded-lg shadow-xl w-full object-cover aspect-[3/4]"
                        />
                        <div>
                            <h3 className="font-bold font-serif text-xl text-slate-900 dark:text-white mb-4">
                                Each issue of <em className="italic">Debt & Dominion</em> delivers:
                            </h3>
                            <ul className="space-y-3 list-disc list-inside text-slate-700 dark:text-brand-medium">
                                <li>Original, <strong className="font-semibold text-slate-800 dark:text-slate-200">long-form articles</strong> grounded in academic research</li>
                                <li>Sharp <strong className="font-semibold text-slate-800 dark:text-slate-200">editorial analysis</strong> of economic and political systems</li>
                                <li><strong className="font-semibold text-slate-800 dark:text-slate-200">Design-led storytelling magazine</strong> that makes complex topics accessible</li>
                                <li>A <strong className="font-semibold text-slate-800 dark:text-slate-200">platform for global student collaboration</strong></li>
                            </ul>
                            <p className="mt-6 text-slate-700 dark:text-brand-medium">
                                We are not another opinion blog. We are not just a student magazine. We are building a <strong className="font-semibold text-slate-800 dark:text-slate-200">new kind of publication</strong>—one that reflects the intelligence, urgency, and complexity of our time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;