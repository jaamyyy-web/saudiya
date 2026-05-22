import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Crown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import AuthGate from './AuthGate.jsx';
import AdminUpload from './AdminUpload.jsx';
import './styles.css';

const stats = [
  { label: 'Students', value: '12,480', change: '+18%', icon: Users },
  { label: 'Learning Packs', value: '326', change: '+42', icon: BookOpen },
  { label: 'Pending Reviews', value: '74', change: 'Needs action', icon: FileText },
  { label: 'Premium Users', value: '2,138', change: '+9%', icon: Crown },
];

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content', label: 'Learning Packs', icon: BookOpen },
  { id: 'generation', label: 'AI Quiz Review', icon: Brain },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const packs = [
  { grade: 'Grade 7', subject: 'Islamic Studies', title: 'Faith and Good Character', status: 'Published', questions: 38 },
  { grade: 'Grade 8', subject: 'Science', title: 'Chemical Reactions', status: 'Draft', questions: 27 },
  { grade: 'Grade 9', subject: 'Math', title: 'Linear Equations', status: 'Review', questions: 41 },
  { grade: 'Grade 7', subject: 'English', title: 'Reading Comprehension', status: 'Published', questions: 33 },
];

const reviewQueue = [
  { type: 'MCQ', subject: 'Science', issue: 'Needs better explanation', score: 82 },
  { type: 'FIB', subject: 'Islamic Studies', issue: 'Clean output', score: 96 },
  { type: 'HOQ', subject: 'Math', issue: 'Check difficulty level', score: 74 },
  { type: 'TF', subject: 'Arabic', issue: 'Possible duplicate', score: 68 },
];

const students = [
  { name: 'Ahmed Al Harbi', grade: 'Grade 7', plan: 'Premium', progress: 78, streak: 8 },
  { name: 'Sara Mohammed', grade: 'Grade 8', plan: 'Free', progress: 34, streak: 2 },
  { name: 'Fahad Saleh', grade: 'Grade 9', plan: 'Family', progress: 91, streak: 21 },
  { name: 'Noura Ali', grade: 'Grade 7', plan: 'Premium', progress: 66, streak: 5 },
];

function App({ user, logout }) {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const title = useMemo(() => navItems.find((item) => item.id === active)?.label || 'Dashboard', [active]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark">S</div>
          <div><div className="brand-title">SAD Admin</div><div className="brand-subtitle">Saudi Education Control</div></div>
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => { setActive(item.id); setSidebarOpen(false); }}><Icon size={19} /><span>{item.label}</span></button>;
          })}
        </nav>
        <div className="sidebar-card"><ShieldCheck size={22} /><div><strong>Signed in securely</strong><p>{user?.email || 'Firebase admin account'}</p></div></div>
      </aside>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div><p className="eyebrow">Admin Panel</p><h1>{title}</h1></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={17} /><input placeholder="Search students, packs, quizzes..." /></div>
            <button className="logout-button" onClick={logout}><LogOut size={17} />Logout</button>
          </div>
        </header>

        {active === 'dashboard' && <Dashboard user={user} setActive={setActive} />}
        {active === 'content' && <ContentManager user={user} />}
        {active === 'generation' && <QuizReview />}
        {active === 'students' && <Students />}
        {active === 'subscriptions' && <Subscriptions />}
        {active === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
}

function Dashboard({ user, setActive }) {
  return (
    <section className="page-grid">
      <div className="hero-card wide">
        <div>
          <p className="eyebrow">Premium PC Admin</p>
          <h2>Manage app content, AI quiz generation, students, and subscriptions from one URL.</h2>
          <p>Upload files now saves to Firebase Storage and creates a Firestore record for admin processing.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setActive('content')}>Open Upload Manager</button>
            <button className="secondary-button"><Sparkles size={18} /> Generate Quiz</button>
          </div>
        </div>
        <div className="hero-visual"><GraduationCap size={74} /></div>
      </div>

      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Firebase Upload</p><h3>Quick Upload</h3></div><span className="badge success">Storage + Firestore</span></div>
        <AdminUpload user={user} />
      </div>

      <div className="stats-grid wide">
        {stats.map((stat) => { const Icon = stat.icon; return <div className="stat-card" key={stat.label}><div className="stat-icon"><Icon size={22} /></div><div className="stat-value">{stat.value}</div><div className="stat-label">{stat.label}</div><div className="stat-change">{stat.change}</div></div>; })}
      </div>
      <div className="panel-card"><div className="panel-header"><h3>Recent Learning Packs</h3><button className="text-button">View all</button></div><PackTable /></div>
      <div className="panel-card"><div className="panel-header"><h3>AI Quality Queue</h3><span className="badge warning">74 pending</span></div><ReviewList /></div>
    </section>
  );
}

function ContentManager({ user }) {
  return (
    <section className="page-grid">
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Content</p><h3>Upload Learning Pack Source</h3></div><span className="badge success">Firebase connected</span></div>
        <AdminUpload user={user} />
      </div>
      <div className="panel-card wide"><PackTable /></div>
    </section>
  );
}

function QuizReview() {
  return <section className="page-grid"><div className="panel-card wide"><div className="panel-header"><div><p className="eyebrow">Gold Rubric</p><h3>AI Quiz Review Queue</h3></div><button className="secondary-button"><Brain size={18} /> Generate More</button></div><ReviewList expanded /></div></section>;
}

function Students() {
  return <section className="page-grid"><div className="panel-card wide"><div className="panel-header"><h3>Students</h3><span className="badge success">Live analytics</span></div><div className="student-list">{students.map((student) => <div className="student-row" key={student.name}><div className="avatar">{student.name.charAt(0)}</div><div><strong>{student.name}</strong><p>{student.grade} • {student.plan} • {student.streak} day streak</p></div><div className="progress-pill">{student.progress}%</div></div>)}</div></div></section>;
}

function Subscriptions() {
  return <section className="page-grid"><PlanBox title="Free" price="0 SAR" features={['First learning pack free', 'Limited quizzes', 'Basic progress']} /><PlanBox title="Single Premium" price="39 SAR" highlighted features={['All packs unlocked', 'Unlimited quizzes', 'Smart analytics', '2 devices']} /><PlanBox title="Family Premium" price="99 SAR" features={['4 student profiles', 'Parent dashboard', '6 devices', 'Family reports']} /></section>;
}

function SettingsPanel() {
  return <section className="page-grid"><div className="panel-card wide"><div className="panel-header"><h3>Deployment Settings</h3><span className="badge">Firebase Auth</span></div><div className="settings-list"><SettingItem title="Firebase web login" body="Email/password and Google login are enabled in the web admin shell." /><SettingItem title="Firebase upload" body="Admin uploads save files to Firebase Storage and metadata to Firestore collection admin_uploads." /><SettingItem title="Admin permission" body="Use VITE_ADMIN_EMAILS or Firestore collection admin_users/{uid} with active=true and role=admin/editor/super_admin." /></div></div></section>;
}

function PackTable() {
  return <div className="table-wrap"><table><thead><tr><th>Grade</th><th>Subject</th><th>Learning Pack</th><th>Status</th><th>Questions</th></tr></thead><tbody>{packs.map((pack) => <tr key={pack.title}><td>{pack.grade}</td><td>{pack.subject}</td><td>{pack.title}</td><td><span className={`badge ${pack.status.toLowerCase()}`}>{pack.status}</span></td><td>{pack.questions}</td></tr>)}</tbody></table></div>;
}

function ReviewList({ expanded = false }) {
  return <div className="review-list">{reviewQueue.map((item) => <div className="review-item" key={`${item.type}-${item.subject}`}><div className="review-icon"><Brain size={20} /></div><div><strong>{item.subject} • {item.type}</strong><p>{item.issue}</p></div><div className="score-badge">{item.score}%</div>{expanded && <button className="small-button"><CheckCircle2 size={15} /> Approve</button>}</div>)}</div>;
}

function PlanBox({ title, price, features, highlighted = false }) {
  return <div className={`plan-box ${highlighted ? 'highlighted' : ''}`}><div className="plan-icon">{highlighted ? <Crown size={28} /> : <Lock size={28} />}</div><h3>{title}</h3><div className="plan-price">{price}</div><ul>{features.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function SettingItem({ title, body }) { return <div className="setting-item"><strong>{title}</strong><p>{body}</p></div>; }

createRoot(document.getElementById('root')).render(<AuthGate>{({ user, logout }) => <App user={user} logout={logout} />}</AuthGate>);
