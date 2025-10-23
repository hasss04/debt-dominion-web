import React from 'react';

const teamMembers = [
  {
    name: 'Miss Vedika Joshi',
    title: 'Founder / Editor - in - Chief',
    bio: 'Vedika is a student of Economics and Finance at the University of Winchester and a Royal Navy Officer Cadet (URNU). She brings a rare combination of intellectual curiosity, leadership, and operational discipline to the publication. Her background spans university governance, policy engagement, and financial training, with experience across organisations such as the Royal Navy Leadership Institute and as a University Student Union Trustee. Vedika is also a Model UN chair with multilingual fluency and embodies the cross-sector insight Debt & Dominion was founded to represent.',
  },
  {
    name: 'Mr Victor Ohagwasi',
    title: 'Consultant',
    bio: "Victor is a Data Analyst and Brand/Product Designer currently embedded in the World Bank-supported L-PRES project in Lokoja, delivering strategic progress reports to World Bank management and state stakeholders. With advanced technical skills in Python, Excel, and Figma, plus a background in UX design and digital marketing, Victor ensures Debt & Dominion's operational workflows are both data-driven and user-centric, while bringing global development insights directly from one of the world's leading financial institutions.",
  },
  {
    name: 'Mr Joshua Pinto',
    title: 'Finance and Sponsorship Lead',
    bio: 'Joshua is a First-Class Economics & Finance graduate from Lancaster University, with hands-on experience in financial analysis and treasury operations. At Debt & Dominion, Joshua drives our sponsorship strategy and financial planning—creating robust funding proposals, structuring budgets, and ensuring our growth is underpinned by sound quantitative insight and strategic foresight.',
  },
  {
    name: 'Mr Dhanush Kumar',
    title: 'Web Developer Lead',
    bio: "Currently pursuing a B.Tech in Computer Science with a specialisation in Artificial Intelligence and Machine Learning at Sri Ramachandra Institute of Higher Education and Research, Dhanush brings a potent blend of technical acumen and strategic communication to the team. His experience in digital marketing at Karmactive, where he contributed to impactful campaigns through sophisticated content strategy and compelling storytelling, provides him with a unique perspective on user engagement. At Debt & Dominion, Dhanush architects our digital platform, ensuring a seamless and intuitive user experience. He is passionate about merging his AI/ML expertise with innovative marketing strategies to create data-driven solutions that amplify our reach and impact at the critical intersection of technology and global discourse.",
  },
];

const TeamSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight text-slate-900 dark:text-brand-light">
            Meet Our Team
          </h2>
          <p className="mt-4 max-w-4xl mx-auto text-lg text-slate-600 dark:text-brand-medium">
            The intellectual engine behind <em className="font-serif italic">Debt & Dominion</em> is powered by a diverse cohort of students, recent graduates, and early-career thinkers from leading universities around the world. While we may not bring decades of experience, we bring something different—<strong className="text-slate-800 dark:text-slate-200">unfiltered curiosity, fresh academic thinking</strong>, and a commitment to tackling complexity with clarity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg border-l-4 border-brand-primary">
              <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">{member.name}</h3>
              <p className="text-lg font-semibold text-brand-primary mb-4">{member.title}</p>
              <p className="text-slate-600 dark:text-brand-medium leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;