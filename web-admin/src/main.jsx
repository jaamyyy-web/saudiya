import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { BookOpen, Brain, Crown, FileText, GraduationCap, LayoutDashboard, Lock, LogOut, Menu, Search, Settings, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import AuthGate from './AuthGate.jsx';
import AdminUpload from './AdminUpload.jsx';
import UploadList from './UploadList.jsx';
import LearningPackList from './LearningPackList.jsx';
import QuestionReviewList from './QuestionReviewList.jsx';
import GenerationJobList from './GenerationJobList.jsx';
import StudentList from './StudentList.jsx';
import SubscriptionList from './SubscriptionList.jsx';
import DemoPackButton from './DemoPackButton.jsx';
import AdminUsersList from './AdminUsersList.jsx';
import { db } from './firebase.js';
import './styles.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content', label: 'Learning Packs', icon: BookOpen },
  { id: 'generation', label: 'AI Quiz Review', icon: Brain },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ─── Live dashboard stat counts ────────────────────────────────────────────────
function useDashboardStats() {
  const [counts, setCounts] = useState({ students: '…', packs: '…', pending: '…', premium: '…' });

  useEffect(() => {
    if (!db) return;

    async function load() {
      try {
        const [studentsSnap, packsSnap, pendingSnap, premiumSnap] = await Promise.all([
          getCountFromServer(collection(db, 'students')),
          getCountFromServer(query(collection(db, 'learning_packs'), where('status', '==', 'published'))),
          getCountFromServer(query(collection(db, 'admin_uploads'), where('reviewStatus', '==', 'draft'))),
          getCountFromServer(query(collection(db, 'subscriptions'), where('status', '==', 'active'))),
        ]);
        setCounts({
          students: studentsSnap.data().count,
          packs: packsSnap.data().count,
          pending: pendingSnap.data().count,
          premium: premiumSnap.data().count,
        });
      } catch (err) {
        console.warn('Stats load failed:', err.message);
      }
    }

    load();
  }, []);

  return counts;
}

// ─── App shell ─────────────────────────────────────────────────────────────────
function App({ user, logout }) {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const title = useMemo(() => navItems.find((item) => item.id === active)?.label || 'Dashboard', [active]);

  function navigate(id) {
    setActive(id);
    setSearchQuery('');
    setSidebarOpen(false);
  }

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
            return (
              <button
                key={item.id}
                className={`nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
              >
                <Icon size={19} /><span>{item.label}</span>
              </button>
            );
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
            <div className="search-box">
              <Search size={17} />
              <input
                id="admin-global-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, packs, uploads..."
              />
              {searchQuery && (
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }} onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>
            <button className="logout-button" onClick={logout}><LogOut size={17} />Logout</button>
          </div>
        </header>

        {active === 'dashboard'     && <Dashboard     user={user} setActive={navigate} searchQuery={searchQuery} />}
        {active === 'content'       && <ContentManager user={user} searchQuery={searchQuery} />}
        {active === 'generation'    && <QuizReview     searchQuery={searchQuery} />}
        {active === 'students'      && <Students        searchQuery={searchQuery} />}
        {active === 'subscriptions' && <Subscriptions />}
        {active === 'settings'      && <SettingsPanel user={user} />}
      </main>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user, setActive, searchQuery }) {
  const counts = useDashboardStats();

  const statCards = [
    { label: 'Students', value: counts.students, change: 'Registered in app', icon: Users },
    { label: 'Published Packs', value: counts.packs, change: 'Live in student app', icon: BookOpen },
    { label: 'Pending Reviews', value: counts.pending, change: 'Uploads awaiting approval', icon: FileText },
    { label: 'Premium Users', value: counts.premium, change: 'Active subscriptions', icon: Crown },
  ];

  return (
    <section className="page-grid">
      <div className="hero-card wide">
        <div>
          <p className="eyebrow">Premium PC Admin</p>
          <h2>Manage app content, quiz generation, students, and subscriptions from one URL.</h2>
          <p>Upload files, publish Learning Packs, queue generation jobs, review questions, manage students, and track subscriptions.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setActive('content')}>Open Upload Manager</button>
            <button className="secondary-button" onClick={() => setActive('generation')}><Sparkles size={18} /> Review Queue</button>
          </div>
        </div>
        <div className="hero-visual"><GraduationCap size={74} /></div>
      </div>

      {/* Live stat cards with real Firestore counts */}
      <div className="stats-grid wide">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={stat.label}>
              <div className="stat-icon"><Icon size={22} /></div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-change">{stat.change}</div>
            </div>
          );
        })}
      </div>

      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Test Mode</p><h3>Create Live Demo Pack</h3></div><span className="badge success">No Gemini needed</span></div>
        <DemoPackButton />
      </div>
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Firebase Upload</p><h3>Quick Upload</h3></div><span className="badge success">Storage + Firestore</span></div>
        <AdminUpload user={user} />
      </div>
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Published Content</p><h3>Live Learning Packs</h3></div><span className="badge success">learning_packs</span></div>
        <LearningPackList searchQuery={searchQuery} />
      </div>
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Live Firestore</p><h3>Latest Uploads &amp; Review Status</h3></div><span className="badge warning">admin_uploads</span></div>
        <UploadList searchQuery={searchQuery} />
      </div>
    </section>
  );
}

// ─── Content Manager ────────────────────────────────────────────────────────────
function ContentManager({ user, searchQuery }) {
  return (
    <section className="page-grid">
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Test Mode</p><h3>Create Live Demo Pack</h3></div><span className="badge success">No Gemini needed</span></div>
        <DemoPackButton />
      </div>
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Content</p><h3>Upload Learning Pack Source</h3></div><span className="badge success">Firebase connected</span></div>
        <AdminUpload user={user} />
      </div>
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Published Content</p><h3>Learning Packs</h3></div><span className="badge success">Show / Hide</span></div>
        <LearningPackList searchQuery={searchQuery} />
      </div>
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Live Firestore</p><h3>Uploaded Sources</h3></div><span className="badge warning">Approve / Publish / Reject</span></div>
        <UploadList searchQuery={searchQuery} />
      </div>
    </section>
  );
}

// ─── AI Quiz Review ─────────────────────────────────────────────────────────────
function QuizReview({ searchQuery }) {
  return (
    <section className="page-grid">
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Pipeline</p><h3>Generation Jobs Monitor</h3></div><span className="badge warning">generation_jobs</span></div>
        <GenerationJobList />
      </div>
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Gold Rubric</p><h3>Question Review Bank</h3></div><span className="badge success">questions</span></div>
        <QuestionReviewList />
      </div>
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Source Queue</p><h3>Uploads Waiting for Generation</h3></div><span className="badge warning">admin_uploads</span></div>
        <UploadList searchQuery={searchQuery} />
      </div>
    </section>
  );
}

// ─── Students ──────────────────────────────────────────────────────────────────
function Students({ searchQuery }) {
  return (
    <section className="page-grid">
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Live Firestore</p><h3>Students</h3></div><span className="badge success">students</span></div>
        <StudentList externalSearch={searchQuery} />
      </div>
    </section>
  );
}

// ─── Subscriptions ─────────────────────────────────────────────────────────────
function Subscriptions() {
  return (
    <section className="page-grid">
      <PlanBox title="Free" price="0 SAR" features={['First learning pack free', 'Limited quizzes', 'Basic progress']} />
      <PlanBox title="Single Premium" price="39 SAR" highlighted features={['All packs unlocked', 'Unlimited quizzes', 'Smart analytics', '2 devices']} />
      <PlanBox title="Family Premium" price="99 SAR" features={['4 student profiles', 'Parent dashboard', '6 devices', 'Family reports']} />
      <div className="panel-card wide">
        <div className="panel-header"><div><p className="eyebrow">Live Firestore</p><h3>Subscription Management</h3></div><span className="badge success">subscriptions</span></div>
        <SubscriptionList />
      </div>
    </section>
  );
}

// ─── Settings ──────────────────────────────────────────────────────────────────
function SettingsPanel({ user }) {
  return (
    <section className="page-grid">
      {/* Admin Users Management */}
      <div className="panel-card wide">
        <div className="panel-header">
          <div><p className="eyebrow">Access Control</p><h3>Admin Users</h3></div>
          <span className="badge success">admin_users</span>
        </div>
        <AdminUsersList />
      </div>

      {/* Deployment Info */}
      <div className="panel-card wide">
        <div className="panel-header"><h3>Deployment Settings</h3><span className="badge">Firebase Auth</span></div>
        <div className="settings-list">
          <SettingItem
            title="Signed in as"
            body={user?.email || 'Unknown — check Firebase Auth'}
          />
          <SettingItem
            title="Firebase upload"
            body="Admin uploads save files to Firebase Storage and metadata to Firestore collection admin_uploads."
          />
          <SettingItem
            title="Students &amp; subscriptions"
            body="Students page reads live records from Firestore collection students. Subscriptions reads from subscriptions."
          />
          <SettingItem
            title="Gemini API Key"
            body="Set via Firebase CLI: firebase functions:config:set gemini.key=YOUR_KEY && firebase deploy --only functions. Or set GEMINI_API_KEY env variable before deploy."
          />
          <SettingItem
            title="Admin emails whitelist"
            body="Set VITE_ADMIN_EMAILS=email1@x.com,email2@x.com in your .env file or Vercel environment variables to allow access without a Firestore admin_users record."
          />
        </div>
      </div>
    </section>
  );
}

// ─── Shared helpers ────────────────────────────────────────────────────────────
function PlanBox({ title, price, features, highlighted = false }) {
  return (
    <div className={`plan-box ${highlighted ? 'highlighted' : ''}`}>
      <div className="plan-icon">{highlighted ? <Crown size={28} /> : <Lock size={28} />}</div>
      <h3>{title}</h3>
      <div className="plan-price">{price}</div>
      <ul>{features.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function SettingItem({ title, body }) {
  return (
    <div className="setting-item">
      <strong dangerouslySetInnerHTML={{ __html: title }} />
      <p>{body}</p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <AuthGate>{({ user, logout }) => <App user={user} logout={logout} />}</AuthGate>
);
