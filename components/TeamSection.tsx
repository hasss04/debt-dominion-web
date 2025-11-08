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
    bio: "Joshua Pinto is a recent graduate from Lancaster University who studied Economics and Finance and is currently working in the finance department at Indie Campers in Portugal. He enjoys working with numbers and understanding the ins and outs of a business. At Debt & Dominion, he is part of the finance team and helps in sponsorship coordination as well, responsible for helping manage the future of the magazine’s growth.",
  },
  {
    name: "Mr Dhanush Kumar",
    title: "Web Developer Lead",
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
    bio: "Currently pursuing a B.Tech in Computer Science with a specialisation in Artificial Intelligence and Machine Learning at Sri Ramachandra Institute of Higher Education and Research, Hassan brings practical experience in backend and full-stack development, supported by a strong grounding in applied AI. Having worked as a backend developer intern at a technology startup, he contributed to building scalable APIs and optimising performance within agile environments. At Debt & Dominion, he applies his expertise in AI-driven engineering to strengthen the publication's digital platform, integrating automation, enhancing infrastructure, and ensuring every system remains secure, efficient, and future-ready.",
  },
  {
    name: "Miss Suwetha",
    title: "Graphic Designer",
    image: "https://picsum.photos/seed/suwetha/400/400",
    linkedin: "#",
    email: "#",
    bio: "Suwetha is an Engineering Graduate and a passionate designer with a Professional Design Certificate from Google. She merges technical skills like User Research, Wireframing, and Branding with creative execution using tools like Figma, Adobe Suite, and Canva. As a Graphic Designer at Debt & Dominion, she develops clean, engaging layouts and ensures high-quality publications that adhere to brand standards.",
  },
  {
    name: "Mr Prinesen Govender",
    title: "3D Animation & Visual Designer",
    image: "https://picsum.photos/seed/prinesen/400/400",
    linkedin: "#",
    email: "#",
    bio: "Prinesen Govender is a 3D Animation graduate from The Animation School, where he specialized in look development and rigging. His studies focused on 3D modeling, character creation, and visual storytelling, giving him a strong foundation in both the artistic and technical sides of animation. Proficient in Maya, Substance, Photoshop, and Premiere Pro, Prinesen combines creative vision with precision and collaboration. At Debt & Dominion, he brings stories to life through expressive animation and imaginative world-building—pushing the boundaries of visual storytelling with every project.",
  },
  {
    name: "Miss Saniya Patel",
    title: "Sponsorship Coordinator",
    image: "https://picsum.photos/seed/saniya/400/400",
    linkedin: "#",
    email: "#",
    bio: "Saniya Patel is a Master’s student studying Accounting and Management and is currently pursuing her CIMA qualification. With a strong interest in accounting and finance, she enjoys working with numbers and analysing business performance. At Debt & Dominion, she serves as the Sponsorship Coordinator, responsible for creating pitch decks, reaching out to potential sponsors, and managing outreach initiatives to build lasting partnerships and support the magazine’s growth.",
  },
  {
    name: "Mr Daniel",
    title: "International Relations & Politics Lead",
    image: "https://picsum.photos/seed/daniel/400/400",
    linkedin: "#",
    email: "#",
    bio: "Daniel is a BA Philosophy graduate from University College London (UCL) where he achieved a top 2:1 and strengthened his expertise in political philosophy, global affairs, and ethical critique. Proficient in editorial workflows, journalistic writing, and managing leadership roles, Daniel oversees teams with editorial direction and expertise. At Debt & Dominion, Daniel handles the International Relations & Politics chapter—ensuring each issue is globally minded and audience-focused.",
  },
  {
    name: "Miss Rinesa",
    title: "Team Leader",
    image: "https://picsum.photos/seed/rinesa/400/400",
    linkedin: "#",
    email: "#",
    bio: "Rinesa is a Law student at the University of Prishtina. She combines her background in law and creative direction in marketing and design. As the Team Leader at Debt & Dominion, Rinesa oversees content strategy, branding, and publication design—ensuring every issue reflects clarity, creativity, and purpose. Skilled in Canva, Adobe Illustrator, and Wix, she brings organization, vision, and a collaborative spirit to every project.",
  },
  {
    name: "Miss Ankita",
    title: "Editor",
    image: "https://picsum.photos/seed/ankita/400/400",
    linkedin: "#",
    email: "#",
    bio: "Ankita is a BA (Honours) final-year student studying English Literature at the University of Warwick. She has honed her written and analytical skills through her course, developing a keen eye for detail and research. Ankita has worked as an editor, accredited in a published anthology. At Debt & Dominion, she works with her team to ensure high-quality, well-researched journal articles on various topics.",
  },
];

const TeamSection: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedMember = selected !== null ? teamMembers[selected] : null;
  const remainingMembers = teamMembers.filter((_, i) => i !== selected);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selected !== null && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  return (
    <section
      ref={sectionRef}
      className="py-14 sm:py-16 bg-slate-50 dark:bg-[#0b132b] transition-colors duration-500"
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {selectedMember ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 sm:mb-8 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Team
              </button>

              <div className="bg-white dark:bg-[#1c2541] border-l-4 border-orange-500 rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 mb-10 sm:mb-12 text-center transition-colors duration-500">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-orange-500 mb-4 sm:mb-6 shadow-md mx-auto"
                />
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                  {selectedMember.name}
                </h3>
                <p className="text-base sm:text-lg font-semibold text-orange-500 mb-5 sm:mb-6">
                  {selectedMember.title}
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-justify leading-relaxed max-w-3xl mx-auto mb-6 sm:mb-8">
                  {selectedMember.bio}
                </p>

                <div className="flex justify-center gap-6 sm:gap-8">
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

              <h4 className="text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8 text-slate-900 dark:text-white">
                Our Team
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {remainingMembers.map((member, index) => (
                  <motion.button
                    type="button"
                    key={index}
                    onClick={() => setSelected(teamMembers.indexOf(member))}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full max-w-sm mx-auto bg-white dark:bg-[#1c2541] border-l-4 border-orange-500 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-orange-400/30 transition-all duration-300 cursor-pointer text-left"
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 mb-4 shadow-md"
                      />
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm sm:text-md font-semibold text-orange-500">
                        {member.title}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
                  Meet Our Team
                </h2>
                <p className="mt-4 max-w-4xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300">
                  The intellectual engine behind{" "}
                  <em className="font-serif italic">Debt & Dominion</em> is powered by a diverse cohort of thinkers and creators from around the world.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {teamMembers.map((member, index) => (
                  <motion.button
                    type="button"
                    key={index}
                    onClick={() => setSelected(index)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full max-w-sm mx-auto bg-white dark:bg-[#1c2541] border-l-4 border-orange-500 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-orange-400/30 transition-all duration-300 cursor-pointer text-left"
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 mb-4 shadow-md"
                      />
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm sm:text-md font-semibold text-orange-500">
                        {member.title}
                      </p>
                    </div>
                  </motion.button>
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