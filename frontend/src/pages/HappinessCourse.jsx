import React from 'react';
import { Link } from 'react-router-dom';

function HappinessCourse() {
  const modules = [
    {
      id: 1,
      title: 'Body Relaxation',
      weightage: 'Pillar 1',
      focus: 'Body health & relaxation',
      bullets: [
        'Introduction to happiness, body health & happiness',
        'Relaxation as a core value – concept and significance',
        'Healthy food habits: pranic & non‑pranic foods',
        'Yog Nidra / intense physical work for deep sleep',
        'Body acceptance and understanding body memory (Runanubandha)',
        'Self‑hypnosis and other contemporary practices'
      ]
    },
    {
      id: 2,
      title: 'Disciplined Mind',
      weightage: 'Pillar 2',
      focus: 'Joyful, focused mind',
      bullets: [
        'Relationship between mental health and happiness',
        'Disciplined mind as a value – concept and significance',
        'Will‑power development and creative visualization',
        'SCV formula for happiness',
        'Catharsis, happy self‑talks, anger trigger mind‑map',
        'Overcoming self‑doubt & self‑hatred (SDSH)'
      ]
    },
    {
      id: 3,
      title: 'Spiritual Sense',
      weightage: 'Pillar 3',
      focus: 'Beyond body & mind',
      bullets: [
        'Spiritual happiness vs body and mental happiness',
        'Laughter therapy and random acts of gratitude',
        'Vortex breathing and love as spiritual practices',
        'Aloneness and meditation practices'
      ]
    },
    {
      id: 4,
      title: 'Happiness at Workplace',
      weightage: 'Pillar 4',
      focus: 'Resilience at work',
      bullets: [
        'Organizational culture of wellness & happiness at work',
        'Resilience as a value – concept and significance',
        'Awareness centering techniques (psychic centres)',
        'Walking meditation and zen‑garden ideas',
        'Creating small happy moments at work',
        '“Unclutching” mindset to recover from failures'
      ]
    },
    {
      id: 5,
      title: 'Digital Detox',
      weightage: 'Pillar 5',
      focus: 'Healthy technology use',
      bullets: [
        'Attention, attention span & sleep disruption',
        'Personal digital wellness plan (3 habits to reduce, 3 offline activities, 1 weekly detox)',
        'Blue light, circadian rhythm and brain functioning',
        'Detox zones, digital calorie audits & sleep hygiene',
        '24‑hour digital fasting, FOMO & compulsive checking'
      ]
    },
    {
      id: 6,
      title: 'Youth Happiness Toolkit',
      weightage: 'Pillar 6',
      focus: 'First‑aid for body, mind, emotions & spirit',
      bullets: [
        'Body first‑aid: zero‑voltage, barefoot walk, EFT tapping, hydration',
        'Mind first‑aid: manifestation science, reframing & journaling',
        'Emotional first‑aid: emotion labelling & safe buddy',
        'Spiritual first‑aid: volunteering, elemental wash, silence'
      ]
    }
  ];

  const learningOutcomes = [
    'Create personalised wellness routines using relaxation techniques.',
    'Apply mental discipline techniques in daily life.',
    'Integrate spiritual practices to understand and manage limitations.',
    'Implement workplace wellness and resilience strategies.',
    'Develop digital detox protocols and a practical happiness toolkit.'
  ];

  return (
    <div className="container">
      <div className="happiness-hero card">
        <div className="happiness-hero-main">
          <div>
            <h1 className="happiness-title">Happiness Journey inside CampusMate</h1>
            <p className="happiness-subtitle">
              Practical guide inspired by “The Dynamics of Happiness” – translated into daily routines, reflections and class activities you can manage with CampusMate.
            </p>
          </div>
          <div className="happiness-meta">
            <div className="meta-pill">6 Happiness Practice Pillars</div>
            <div className="meta-pill">Body • Mind • Spirit • Work • Digital • Youth Toolkit</div>
          </div>
        </div>

        <div className="happiness-links">
          <span className="happiness-links-label">Use CampusMate to implement this course:</span>
          <div className="happiness-links-grid">
            <Link to="/tasks" className="happiness-link-pill">
              ✅ Plan daily happiness routines (Tasks)
            </Link>
            <Link to="/notes" className="happiness-link-pill">
              📝 Maintain reflection & book‑summary journal (Notes)
            </Link>
            <Link to="/timetable" className="happiness-link-pill disabled">
              ⏰ Timetable blocks for happiness labs
            </Link>
            <Link to="/class-space" className="happiness-link-pill">
              🏫 Share class‑level activities & SAP work (Class Space)
            </Link>
            <Link to="/expenses" className="happiness-link-pill">
              💰 Track wellness‑related expenses (Expense Tracker)
            </Link>
          </div>
          <p className="happiness-links-note">
            These are guidelines on how a happiness journey maps to existing CampusMate features. No existing data or flows are changed.
          </p>
        </div>
      </div>

      <div className="card">
        <h2>Six Happiness Practice Pillars</h2>
        <div className="happiness-modules-grid">
          {modules.map((mod) => (
            <div key={mod.id} className="happiness-module-card">
              <div className="happiness-module-header">
                <div className="module-chip">{mod.weightage}</div>
                <span className="module-focus">{mod.focus}</span>
              </div>
              <h3>{mod.title}</h3>
              <ul className="happiness-list">
                {mod.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Happiness Journey Outcomes</h2>
        <ul className="happiness-list">
          {learningOutcomes.map((outcome, idx) => (
            <li key={idx}>{outcome}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>How CampusMate Supports Your Happiness Journey</h2>
        <div className="happiness-support-grid">
          <div className="happiness-support-card">
            <h3>1. PersonalTasks as a Happiness Routine Planner ✅</h3>
            <p>
              Use <strong>Tasks & Deadlines</strong> as your <strong>daily happiness routine planner</strong>. Add tasks like 
              “10‑minute body relaxation”, “Evening gratitude journaling” or “Digital detox 30 minutes before sleep”, and use 
              the <strong>priority</strong> field to mark what is essential (for example meditation and digital detox) versus optional.
            </p>
            <p style={{ marginTop: '6px' }}>
              You can also create <strong>module‑wise task lists</strong>, for example: Module 1 (Body Relaxation) – “Practice Yog Nidra”, 
              “Track sleep quality”; Module 2 (Disciplined Mind) – “SCV formula reflection”, “Anger trigger mind map”; 
              Module 5 (Digital Detox) – “24‑hour digital fasting”, “Screen time audit”.
            </p>
          </div>
          <div className="happiness-support-card">
            <h3>2. PersonalNotes as a Happiness Journal 📝</h3>
            <p>
              Use <strong>Personal Notes</strong> as your <strong>happiness journal</strong>. Create notes titled 
              “Module 1 – Body Reflections”, “Module 2 – Mind Reflections”, etc., and write how each practice affected your mood, 
              energy and focus.
            </p>
            <p style={{ marginTop: '6px' }}>
              For the PSDA activity, create notes like “Digital Minimalism – Summary & Insights” and 
              “Stoicism and the Art of Happiness – Key Takeaways” to store your book summaries directly inside CampusMate.
            </p>
          </div>
          <div className="happiness-support-card">
            <h3>3. Timetable as a Happiness Schedule ⏰</h3>
            <p>
              Use the <strong>timetable features</strong> of CampusMate (or your existing timetable page) to add 15–30 minute 
              “Happiness Lab” blocks, such as “Module 3 – Spiritual Sense Practice” on specific days. These slots sit next to your 
              other classes so happiness practice becomes part of your official schedule.
            </p>
          </div>
          <div className="happiness-support-card">
            <h3>4. ClassSpace for Group Happiness Activities 🏫</h3>
            <p>
              In <strong>Class Space</strong>, the CR can post weekly happiness briefs (for example, “This week: Digital Detox plan + 
              24‑hr fasting challenge”), share links to meditation audio, recommended YouTube videos on digital wellness, and any 
              supporting PDFs or slides. Students see all happiness‑related tasks and deadlines (essays, SAP‑style activities, reflection uploads) 
              in one shared space.
            </p>
          </div>
          <div className="happiness-support-card">
            <h3>5. Attendance & Assessments for Happiness Labs 📋</h3>
            <p>
              The <strong>Attendance</strong> page can be interpreted as <strong>“Happiness Lab Attendance”</strong> for your practical 
              happiness sessions. Internal‑style components such as Project, Class Performance and SAP can be modelled as specific tasks or 
              notes (for example, “Design your Happiness Box & upload pictures”, “Participate in weekly happiness discussions”, 
              “Community Happiness Campaign plan & report”).
            </p>
          </div>
          <div className="happiness-support-card">
            <h3>6. ExpenseTracker for Happiness‑Aligned Spending 💰</h3>
            <p>
              Use the <strong>Expense Tracker</strong> in a themed way by adding categories such as “Wellness”, “Books” and 
              “Experiences”, and reflecting on whether each expense increases or decreases long‑term well‑being. This connects to 
              the course idea of <strong>intentional living</strong> instead of impulsive consumption.
            </p>
          </div>
          <div className="happiness-support-card">
            <h3>7. A Happiness Toolkit inside CampusMate 🎒</h3>
            <p>
              Together, <strong>PersonalTasks</strong> (daily toolkit actions), <strong>PersonalNotes</strong> (tool explanations 
              and reflections) and <strong>Class Space</strong> (shared tools from teacher and classmates) act as a 
              <strong> Happiness Toolkit implemented inside CampusMate</strong> without changing any of the existing flows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HappinessCourse;

