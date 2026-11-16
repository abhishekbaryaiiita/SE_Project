import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ItineraryCard from '../components/ItineraryCard';
import {
  ArrowRight,
  Map,
  Clock,
  Bookmark,
  Trash2,
  RefreshCw,
  UserRound,
  MessageSquare,
  Star,
  Hotel,
  Wallet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Re-export Dashboard from the dedicated component
export { default as Dashboard } from './Dashboard';

export function History() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = () => {
    setLoading(true);
    api.get('/journeys/history')
      .then(r => setItems(r.data || []))
      .catch(() => setError('Could not load journey history.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  async function del(id) {
    if (!window.confirm('Delete this saved journey?')) return;
    try {
      await api.delete(`/journeys/${id}`);
      load();
    } catch {
      alert('Could not delete journey.');
    }
  }

  return (
    <main className="page-wrap">
      <div className="page-title">
        <span className="eyebrow">YOUR JOURNEYS</span>
        <h1>Journey history</h1>
        <p>Review, replan or remove your saved itineraries and previous route configurations.</p>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <div className="planner-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
          Loading your travel history…
        </div>
      ) : items.length ? (
        <div className="stack">
          {items.slice().reverse().map((j, i) => (
            <div className="history-item" key={j.id}>
              <ItineraryCard item={j} index={i} />
              <div className="history-actions" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => nav('/planner', { state: { replan: j.input, previous: j } })}
                >
                  <RefreshCw size={15} /> Replan route
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => del(j.id)}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bookmark size={36} color="#6053e5" />
          <h3>Your journey list is empty</h3>
          <p>Saved itineraries and multi-modal plans will be available here.</p>
          <Link className="btn btn-primary" to="/planner" style={{ marginTop: 14 }}>
            Plan a journey <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </main>
  );
}

export function ItineraryDetail() {
  const { state } = useLocation();
  const item = state?.item;
  const nav = useNavigate();

  return (
    <main className="page-wrap">
      {!item ? (
        <div className="empty-state">
          <h2>No itinerary selected</h2>
          <p>Please select an itinerary from the planner or your saved journeys.</p>
          <Link to="/planner" className="btn btn-primary" style={{ marginTop: 14 }}>
            Back to planner
          </Link>
        </div>
      ) : (
        <>
          <div className="page-title">
            <span className="eyebrow">ITINERARY DETAILS</span>
            <h1>{item.source} to {item.destination}</h1>
            <p>{item.explanation}</p>

            <button
              className="btn btn-outline"
              type="button"
              style={{ marginTop: 14 }}
              onClick={() => nav('/planner', { state: { restoreResults: true } })}
            >
              ← Back to all journey plans
            </button>
          </div>

          <div className="detail-layout">
            <section className="planner-panel">
              <h2>Journey timeline</h2>
              {item.legs.map((l) => (
                <div className="leg" key={l.id}>
                  <div className="leg-time">
                    <b>{l.departure}</b>
                    <small>{l.from}</small>
                  </div>
                  <div className="leg-track">
                    <span></span>
                    <i>{l.mode}</i>
                    <span></span>
                  </div>
                  <div className="leg-time">
                    <b>{l.arrival}</b>
                    <small>{l.to}</small>
                  </div>
                  <div className="leg-fare">
                    ₹{l.farePerPerson.toLocaleString('en-IN')}
                    <small>{l.service}</small>
                  </div>
                </div>
              ))}

              <h3 style={{ marginTop: 24 }}>Cost breakdown (per person)</h3>
              {item.legs.map((l) => (
                <div className="cost-line" key={l.id}>
                  <span>{l.from} → {l.to} ({l.mode})</span>
                  <b>₹{l.farePerPerson.toLocaleString('en-IN')}</b>
                </div>
              ))}
              <div className="cost-line">
                <span>Accommodation ({item.accommodation?.nights || 0} night(s))</span>
                <b>₹{(item.accommodation?.totalPerPerson || 0).toLocaleString('en-IN')}</b>
              </div>
              <div className="cost-line total">
                <span>Total per person</span>
                <b>₹{item.totalPerPerson.toLocaleString('en-IN')}</b>
              </div>
              <div className="cost-line">
                <span>Total for group ({item.legs[0]?.travellers || 1} traveller(s))</span>
                <b>₹{item.totalGroupCost.toLocaleString('en-IN')}</b>
              </div>
            </section>

            <aside className="planner-panel">
              <h3>Journey summary</h3>
              <div className="summary-number">
                ₹{item.totalPerPerson.toLocaleString('en-IN')}
                <small>per person</small>
              </div>
              <p>{item.elapsedDurationHours.toFixed(1)} hours estimated elapsed time</p>
              <p>{item.transfers} transfer(s)</p>

              {item.accommodation?.required && (
                <div className="hotel-box">
                  <Hotel size={18} color="#6053e5" />
                  <b>{item.accommodation.hotel?.name || 'Hotel stay recommended'}</b>
                  <p>{item.accommodation.city} · {item.accommodation.nights} night(s)</p>
                  {item.accommodation.hotel && (
                    <p>₹{item.accommodation.hotel.pricePerNight.toLocaleString('en-IN')} / night · {item.accommodation.hotel.rating}★</p>
                  )}
                </div>
              )}

              <p className="sim-note">
                Simulated transport schedules, fares and accommodation data.
              </p>
              <Link to="/planner" className="btn btn-primary btn-full" style={{ marginTop: 14 }}>
                Plan another journey
              </Link>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}

export function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferredMode: user?.preferences?.preferredMode || 'Any',
    budgetRange: user?.preferences?.budgetRange || 'Moderate',
    journeyType: user?.preferences?.journeyType || 'Balanced',
    accommodationType: user?.preferences?.accommodationType || 'Any'
  });
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  async function save(e) {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await api.put('/users/me', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        preferences: {
          preferredMode: form.preferredMode,
          budgetRange: form.budgetRange,
          journeyType: form.journeyType,
          accommodationType: form.accommodationType
        }
      });
      setUser(data);
      sessionStorage.setItem('rr_user', JSON.stringify(data));
      setIsSuccess(true);
      setMsg('Profile and travel preferences updated successfully.');
    } catch (e) {
      setIsSuccess(false);
      setMsg(e.response?.data?.message || 'Profile update failed.');
    }
  }

  return (
    <main className="page-wrap narrow">
      <div className="page-title">
        <span className="eyebrow">ACCOUNT SETTINGS</span>
        <h1>Your travel profile</h1>
        <p>Manage your account credentials and default travel preferences for all journey plans.</p>
      </div>

      <form className="planner-panel" onSubmit={save}>
        <label className="field">
          <span>Full name</span>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Phone number</span>
          <input
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </label>

        <label className="field">
          <span>Preferred travel optimization</span>
          <select
            value={form.journeyType}
            onChange={e => setForm({ ...form, journeyType: e.target.value })}
          >
            {['Balanced', 'Cheapest', 'Fastest'].map(x => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Preferred transport mode</span>
          <select
            value={form.preferredMode}
            onChange={e => setForm({ ...form, preferredMode: e.target.value })}
          >
            {['Any', 'Train', 'Bus', 'Flight'].map(x => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Budget tier</span>
          <select
            value={form.budgetRange}
            onChange={e => setForm({ ...form, budgetRange: e.target.value })}
          >
            {['Budget', 'Moderate', 'Premium'].map(x => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Accommodation standard</span>
          <select
            value={form.accommodationType}
            onChange={e => setForm({ ...form, accommodationType: e.target.value })}
          >
            {['Any', 'Budget', 'Standard', 'Premium'].map(x => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </label>

        {msg && (
          <div className={`alert ${isSuccess ? 'success' : 'error'}`}>
            {msg}
          </div>
        )}

        <button className="btn btn-primary btn-lg" type="submit" style={{ marginTop: 10 }}>
          Save profile changes
        </button>
      </form>
    </main>
  );
}

export function Feedback() {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [journeyId, setJourneyId] = useState('');
  const [status, setStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/feedback', {
        rating,
        message,
        journeyId: journeyId.trim() || null
      });
      setIsSuccess(true);
      setStatus('Thank you! Your feedback has been submitted successfully to RouteRescue.');
      setMessage('');
      setJourneyId('');
    } catch (e) {
      setIsSuccess(false);
      setStatus(e.response?.data?.message || 'Could not submit feedback.');
    }
  }

  return (
    <main className="page-wrap narrow">
      <div className="page-title">
        <span className="eyebrow">HELP US IMPROVE</span>
        <h1>Share your feedback</h1>
        <p>Your feedback helps improve RouteRescue routes, timings and accommodation recommendations.</p>
      </div>

      <form className="planner-panel" onSubmit={submit}>
        <label className="field">
          <span>Your rating</span>
          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} / 5 stars {'★'.repeat(n)}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Your experience & comments</span>
          <textarea
            rows="5"
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Tell us what worked well or what we can improve in the journey planner…"
          />
        </label>

        <label className="field">
          <span>Journey reference ID (optional)</span>
          <input
            value={journeyId}
            onChange={e => setJourneyId(e.target.value)}
            placeholder="e.g. past journey ID if related to a specific route"
          />
        </label>

        {status && (
          <div className={`alert ${isSuccess ? 'success' : 'error'}`}>
            {status}
          </div>
        )}

        <button className="btn btn-primary btn-lg" type="submit" style={{ marginTop: 10 }}>
          Submit feedback
        </button>
      </form>
    </main>
  );
}
