import React, { useState } from "react";
import AnimatedBackground from "./AnimatedBackground";

const Partnership: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email address is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    console.log("Submitted email:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Launch Tag */}
        <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1 mb-6 border border-white/20">
          <p className="text-sm font-medium text-orange-300">Launching Soon</p>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400 mb-4 animate-fade-in-down">
          Forge the Future with Us
        </h1>

        {/* Description */}
        <p
          className="text-lg md:text-xl text-orange-300 max-w-xl mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          The future of partnership is under construction. We're forging a
          dynamic ecosystem for collaboration, innovation, and shared growth. Be
          the first to get access when we launch.
        </p>

        {/* Email Form */}
        {!isSubmitted ? (
          <>
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-full relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your business email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-12 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-orange-500 whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>

            {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}

            <div
              className="mt-12 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </>
        ) : (
          <div className="text-center bg-green-500/20 border border-green-400 text-green-200 px-6 py-4 rounded-lg animate-fade-in">
            <h3 className="font-bold text-xl">Thank You!</h3>
            <p>You're on the list. We'll be in touch soon.</p>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Partnership;