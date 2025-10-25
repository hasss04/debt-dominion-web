import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Mail, ArrowLeft } from "lucide-react";

const teamMembers = [
  {
    name: "Miss Vedika Joshi",
    title: "Founder / Editor - in - Chief",
    image: "https://picsum.photos/seed/vedika/400/400",
    linkedin: "#",
    email: "#",
    bio: "Vedika is a student of Economics and Finance at the University of Winchester and a Royal Navy Officer Cadet (URNU). She brings a rare combination of intellectual curiosity, leadership, and operational discipline to the publication. Her background spans university governance, policy engagement, and financial training, with experience across organisations such as the Royal Navy Leadership Institute and as a University Student Union Trustee. Vedika is also a Model UN chair with multilingual fluency and embodies the cross-sector insight Debt & Dominion was founded to represent.",
  },
  {
    name: "Mr Victor Ohagwasi",
    title: "Consultant",
    image: "https://picsum.photos/seed/victor/400/400",
    linkedin: "#",
    email: "#",
    bio: "Victor is a Data Analyst and Brand/Product Designer currently embedded in the World Bank-supported L-PRES project in Lokoja, delivering strategic progress reports to World Bank management and state stakeholders. With advanced technical skills in Python, Excel, and Figma, plus a background in UX design and digital marketing, Victor ensures Debt & Dominion's operational workflows are both data-driven and user-centric, while bringing global development insights directly from one of the world's leading financial institutions.",
  },
  {
    name: "Mr Joshua Pinto",
    title: "Finance and Sponsorship Lead",
    image: "https://picsum.photos/seed/joshua/400/400",
    linkedin: "#",
    email: "#",
    bio: "Joshua is a First-Class Economics & Finance graduate from Lancaster University, with hands-on experience in financial analysis and treasury operations. At Debt & Dominion, Joshua drives our sponsorship strategy and financial planning—creating robust funding proposals, structuring budgets, and ensuring our growth is underpinned by sound quantitative insight and strategic foresight.",
  },
  {
    name: "Mr Dhanush Kumar",
    title: "Web Developer",
    image: "https://picsum.photos/seed/dhanush/400/400",
    linkedin: "https://www.linkedin.com/in/dhanush-kumar-k-sret/",
    email: "dhanushkumark62@gmail.com",
    bio: "Currently pursuing a B.Tech in Computer Science with a specialisation in Artificial Intelligence and Machine Learning at Sri Ramachandra Institute of Higher Education and Research, Dhanush brings a potent blend of technical acumen and strategic communication to the team. His experience in digital marketing at Karmactive, where he contributed to impactful campaigns through sophisticated content strategy and compelling storytelling, provides him with a unique perspective on user engagement. At Debt & Dominion, Dhanush architects our digital platform, ensuring a seamless and intuitive user experience.",
  },
  {
    name: "Mr Mohammadul Hassan",
    title: "Web Developer",
    image: "https://picsum.photos/seed/hassan/400/400",
    linkedin: "https://www.linkedin.com/in/hassan290904/",
    email: "hassan_a22@outlook.com",
    bio: "Currently pursuing a B.Tech in Computer Science with a specialisation in Artificial Intelligence and Machine Learning at Sri Ramachandra Institute of Higher Education and Research, Hassan brings practical experience in backend and full-stack development, supported by a strong grounding in applied AI. Having worked as a backend developer intern at a technology startup, he contributed to building scalable APIs and optimising performance within agile environments. At Debt & Dominion, he applies his expertise in AI-driven engineering to strengthen the publication’s digital platform, integrating automation, enhancing infrastructure, and ensuring every system remains secure, efficient, and future-ready.",
  },
];

const TeamSection: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedMember = selected !== null ? teamMembers[selected] : null;
  const remainingMembers = teamMembers.filter((_, i) => i !== selected);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // 🧭 Auto-scroll to profile when selected changes
  useEffect(() => {
    if (selected !== null && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-slate-50 dark:bg-[#0b132b] transition-colors duration-500"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {selectedMember ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Back Button */}
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-8 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Team
              </button>

              {/* Full Profile Section */}
              <div className="bg-white dark:bg-[#1c2541] border-l-4 border-orange-500 rounded-lg shadow-lg p-10 mb-12 text-center transition-colors duration-500">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 mb-6 shadow-md mx-auto"
                />
                <h3 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                  {selectedMember.name}
                </h3>
                <p className="text-lg font-semibold text-orange-500 mb-6">
                  {selectedMember.title}
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-justify leading-relaxed max-w-3xl mx-auto mb-8">
                  {selectedMember.bio}
                </p>

                <div className="flex justify-center gap-8">
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-500 transition"
                  >
                    <Linkedin className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                  </a>
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="hover:text-orange-500 transition"
                  >
                    <Mail className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                  </a>
                </div>
              </div>

              {/* Remaining Members */}
              <h4 className="text-2xl font-semibold text-center mb-8 text-slate-900 dark:text-white">
                Our Team
              </h4>

              {/* 3 Top Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center mb-10">
                {remainingMembers.slice(0, 3).map((member, index) => (
                  <motion.div
                    key={index}
                    onClick={() =>
                      setSelected(teamMembers.indexOf(member))
                    }
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white dark:bg-[#1c2541] border-l-4 border-orange-500 p-8 rounded-xl shadow-lg hover:shadow-orange-400/30 transition-all duration-300 w-[20rem] cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 mb-4 shadow-md"
                      />
                      <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-md font-semibold text-orange-500 mb-3">
                        {member.title}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 text-sm text-justify leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 2 Bottom Row */}
              <div className="flex justify-center gap-10">
                {remainingMembers.slice(3).map((member, index) => (
                  <motion.div
                    key={index}
                    onClick={() =>
                      setSelected(teamMembers.indexOf(member))
                    }
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white dark:bg-[#1c2541] border-l-4 border-orange-500 p-8 rounded-xl shadow-lg hover:shadow-orange-400/30 transition-all duration-300 w-[20rem] cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 mb-4 shadow-md"
                      />
                      <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-md font-semibold text-orange-500 mb-3">
                        {member.title}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 text-sm text-justify leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Default Team Grid */
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
                  Meet Our Team
                </h2>
                <p className="mt-4 max-w-4xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                  The intellectual engine behind{" "}
                  <em className="font-serif italic">Debt & Dominion</em> is
                  powered by a diverse cohort of thinkers and creators from
                  around the world.
                </p>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center mb-10">
                {teamMembers.slice(0, 3).map((member, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setSelected(index)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white dark:bg-[#1c2541] border-l-4 border-orange-500 p-8 rounded-xl shadow-lg hover:shadow-orange-400/30 transition-all duration-300 w-[20rem] cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 mb-4 shadow-md"
                      />
                      <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-md font-semibold text-orange-500 mb-3">
                        {member.title}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 text-sm text-justify leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Row */}
              <div className="flex justify-center gap-10">
                {teamMembers.slice(3).map((member, index) => (
                  <motion.div
                    key={index}
                    onClick={() => setSelected(index + 3)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white dark:bg-[#1c2541] border-l-4 border-orange-500 p-8 rounded-xl shadow-lg hover:shadow-orange-400/30 transition-all duration-300 w-[20rem] cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 mb-4 shadow-md"
                      />
                      <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-md font-semibold text-orange-500 mb-3">
                        {member.title}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 text-sm text-justify leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TeamSection;