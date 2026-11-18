import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Map,
  Clock,
  Bookmark,
  ArrowRight,
  Hotel,
  Wallet,
  Compass,
  TrainFront,
  Plane,
  Bus,
  RefreshCw,
  Trash2,
  ShieldCheck,
  UserCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ItineraryCard from '../components/ItineraryCard';

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJourneys = async () => {
    try {
      setLoading(true);
      const res = await api.get('/journeys/history');
      setJourneys(res.data || []);
    } catch (err) {
      setError('Could not load your saved journeys.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneys();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this saved journey?')) return;
    try {
      await api.delete(`/journeys/${id}`);
      setJourneys(prev => prev.filter(j => j.id !== id));
    } catch {
      alert('Could not delete journey.');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const totalSpent = journeys.reduce((sum, j) => sum + (Number(j.totalPerPerson) || 0), 0);
  const totalStays = journeys.filter(j => j.accommodation?.nights > 0).length;

  return (
    <main className="page-wrap">
      {/* Welcome Banner */}
      <div className="welcome-row">
        <div>
          <span className="eyebrow"><Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} /> YOUR PERSONAL TRAVEL HUB</span>
          <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'Traveller'}.</h1>
          <p>
            Welcome to your RouteRescue dashboard. Review your itineraries, track travel budgets, or launch a new journey.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/planner" className="btn btn-primary">
            Plan a new journey <ArrowRight size={16} />
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} color="#6053e5" /> Admin Console
            </Link>
          )}
        </div>
      </div>

      {/* High Level Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <span><Map size={22} color="#6053e5" /></span>
          <small>Saved Journeys</small>
          <b>{journeys.length}</b>
        </div>
        <div className="stat-card">
          <span><Wallet size={22} color="#16a36a" /></span>
          <small>Total Est. Cost (Per Person)</small>
          <b>₹{totalSpent.toLocaleString('en-IN')}</b>
        </div>
        <div className="stat-card">
          <span><Hotel size={22} color="#f59e0b" /></span>
          <small>Trips with Hotel Stays</small>
          <b>{totalStays}</b>
        </div>
        <div className="stat-card">
          <span><Compass size={22} color="#3b82f6" /></span>
          <small>Preferred Mode</small>
          <b>{user?.preferences?.preferredMode || 'Any'}</b>
        </div>
      </div>

      {/* Quick Route Launcher */}
      <div className="planner-panel" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>Quick Route Launcher</h3>
            <small style={{ color: 'var(--muted)' }}>One-click route planning for popular travel corridors</small>
          </div>
          <Link to="/popular-journeys" style={{ fontSize: 13, fontWeight: 700, color: '#6053e5', display: 'flex', alignItems: 'center', gap: 4 }}>
            All routes <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { from: 'Mumbai', to: 'Goa', mode: 'Train · Flight' },
            { from: 'Delhi', to: 'Jaipur', mode: 'Express Train' },
            { from: 'Ahmedabad', to: 'Udaipur', mode: 'Scenic Bus' },
            { from: 'Bengaluru', to: 'Chennai', mode: 'High-speed Rail' }
          ].map(item => (
            <button
              key={`${item.from}-${item.to}`}
              type="button"
              className="btn btn-outline"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px 14px',
                textAlign: 'left'
              }}
              onClick={() => {
                const preset = { source: item.from, destination: item.to };
                sessionStorage.setItem('rr_home_preset', JSON.stringify(preset));
                nav('/planner', { state: { preset, autoPlan: true } });
              }}
            >
              <b style={{ fontSize: 14, color: 'var(--navy)' }}>{item.from} → {item.to}</b>
              <small style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>{item.mode}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Journeys Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.02em' }}>Recent Journeys</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>
            Your saved itineraries, connection details, and replanning options.
          </p>
        </div>
        {journeys.length > 0 && (
          <Link to="/history" style={{ fontSize: 14, fontWeight: 700, color: '#6053e5', display: 'flex', alignItems: 'center', gap: 4 }}>
            View all {journeys.length} journeys <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="planner-panel" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
          Loading your travel history…
        </div>
      ) : journeys.length > 0 ? (
        <div style={{ display: 'grid', gap: 20 }}>
          {journeys.slice(0, 3).map((journey, idx) => (
            <div key={journey.id} className="history-item">
              <ItineraryCard item={journey} index={idx} />
              <div className="history-actions" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => nav('/planner', { state: { replan: journey.input, previous: journey } })}
                >
                  <RefreshCw size={14} /> Replan route
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(journey.id)}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bookmark size={36} color="#6053e5" />
          <h3>No saved journeys yet</h3>
          <p>Plan your first multi-modal trip, compare train, bus and flight options, and save it here.</p>
          <Link to="/planner" className="btn btn-primary" style={{ marginTop: 16 }}>
            Start planning your route <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* User Preferences Quick Overview */}
      <div className="planner-panel" style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserCheck size={20} color="#6053e5" />
            <h3 style={{ margin: 0, fontSize: 18 }}>Travel Preferences Profile</h3>
          </div>
          <Link to="/profile" className="btn btn-outline btn-sm">
            Edit preferences
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ background: 'var(--line)', padding: '12px 16px', borderRadius: 12 }}>
            <small style={{ color: 'var(--muted)', display: 'block' }}>Email</small>
            <b style={{ fontSize: 14 }}>{user?.email}</b>
          </div>
          <div style={{ background: 'var(--line)', padding: '12px 16px', borderRadius: 12 }}>
            <small style={{ color: 'var(--muted)', display: 'block' }}>Preferred Transport</small>
            <b style={{ fontSize: 14 }}>{user?.preferences?.preferredMode || 'Any Mode'}</b>
          </div>
          <div style={{ background: 'var(--line)', padding: '12px 16px', borderRadius: 12 }}>
            <small style={{ color: 'var(--muted)', display: 'block' }}>Budget Strategy</small>
            <b style={{ fontSize: 14 }}>{user?.preferences?.budgetRange || 'Moderate'}</b>
          </div>
          <div style={{ background: 'var(--line)', padding: '12px 16px', borderRadius: 12 }}>
            <small style={{ color: 'var(--muted)', display: 'block' }}>Optimization Goal</small>
            <b style={{ fontSize: 14 }}>{user?.preferences?.journeyType || 'Balanced'}</b>
          </div>
        </div>
      </div>
    </main>
  );
}
