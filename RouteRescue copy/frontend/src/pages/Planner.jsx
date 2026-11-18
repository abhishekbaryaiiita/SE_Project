import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Wallet,
  MapPin,
  SlidersHorizontal,
  ArrowLeftRight,
  CheckCircle2,
  Sparkles,
  TrainFront,
  Bus,
  Plane,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import ItineraryCard from '../components/ItineraryCard';

const today = new Date().toISOString().slice(0, 10);

const DEFAULT_FORM = {
  source: 'Mumbai',
  destination: 'Goa',
  date: today,
  travellers: 1,
  budget: 5000,
  optimization: 'balanced',
  modes: ['Train', 'Bus', 'Flight'],
  overnightStays: 0,
  accommodation: 'none'
};

// Read previously saved planner state
function getSavedPlannerState() {
  try {
    return JSON.parse(
      sessionStorage.getItem('rr_planner_state') || 'null'
    );
  } catch {
    return null;
  }
}

export default function Planner() {
  const nav = useNavigate();
  const location = useLocation();

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  const [form, setForm] = useState(() => {
    const preset = location.state?.preset;
    let modes = DEFAULT_FORM.modes;
    try {
      const storedModes = JSON.parse(sessionStorage.getItem('rr_home_modes') || 'null');
      if (Array.isArray(storedModes) && storedModes.length) modes = storedModes;
    } catch { /* keep the default modes */ }

    if (preset?.source && preset?.destination) {
      sessionStorage.removeItem('rr_home_preset');
      return { ...DEFAULT_FORM, ...preset, modes };
    }
    try {
      const stored = JSON.parse(sessionStorage.getItem('rr_home_preset') || 'null');
      if (stored?.source && stored?.destination) {
        sessionStorage.removeItem('rr_home_preset');
        return { ...DEFAULT_FORM, ...stored, modes };
      }
    } catch { /* ignore a bad preset */ }
    const saved = getSavedPlannerState();
    return saved?.form || DEFAULT_FORM;
  });

  const [results, setResults] = useState(() => {
    return getSavedPlannerState()?.results || [];
  });

  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const [previousPlan, setPreviousPlan] = useState(null);

  // Load available cities
  useEffect(() => {
    setCitiesLoading(true);
    api.get('/users/cities')
      .then(r => {
        const cityList = r.data || [];
        setCities(cityList);
        if (cityList.length >= 2) {
          setForm(prev => {
            const hasSource = cityList.some(c => c.name.toLowerCase() === prev.source.toLowerCase());
            const hasDest = cityList.some(c => c.name.toLowerCase() === prev.destination.toLowerCase());
            return {
              ...prev,
              source: hasSource ? prev.source : cityList[0].name,
              destination: hasDest ? prev.destination : cityList[1].name
            };
          });
        }
      })
      .catch(() =>
        setError('Could not load city list. Is the backend running?')
      )
      .finally(() => setCitiesLoading(false));
  }, []);

  // Save form and results whenever they change
  useEffect(() => {
    sessionStorage.setItem(
      'rr_planner_state',
      JSON.stringify({ form, results })
    );
  }, [form, results]);

  // Handle auto-plan or replan
  useEffect(() => {
    const replan = location.state?.replan;
    if (replan) {
      const next = {
        ...DEFAULT_FORM,
        ...replan,
        modes: replan.modes?.length ? replan.modes : DEFAULT_FORM.modes
      };
      setForm(next);
      setPreviousPlan(location.state.previous || null);
      setResults([]);
      setError('');
      setNote('Replanning from your saved journey. Adjust any field and generate again.');
      setBusy(true);

      api.post('/journeys/plan', next)
        .then(({ data }) => {
          setResults(data.itineraries || []);
          setNote(data.message || '');
          if (!data.itineraries?.length) setError(data.message);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Journey planning failed.');
        })
        .finally(() => setBusy(false));
      return;
    }

    if (location.state?.autoPlan && location.state?.preset) {
      const presetData = {
        ...form,
        source: location.state.preset.source,
        destination: location.state.preset.destination
      };
      setForm(presetData);
      setBusy(true);
      setError('');
      api.post('/journeys/plan', presetData)
        .then(({ data }) => {
          setResults(data.itineraries || []);
          setNote(data.message || '');
          if (!data.itineraries?.length) setError(data.message);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Journey planning failed.');
        })
        .finally(() => setBusy(false));
    }
  }, [location.key]);

  // Update form fields
  const set = (key, value) => {
    setForm(previous => ({
      ...previous,
      [key]: value
    }));
  };

  // Swap origin and destination
  const swapCities = () => {
    setForm(prev => ({
      ...prev,
      source: prev.destination,
      destination: prev.source
    }));
  };

  // Toggle transport modes
  const toggle = mode => {
    const nextModes = form.modes.includes(mode)
      ? form.modes.filter(x => x !== mode)
      : [...form.modes, mode];

    if (nextModes.length === 0) {
      setError('Please keep at least one transport mode selected.');
      return;
    }
    setError('');
    set('modes', nextModes);
  };

  const selectAllModes = () => {
    set('modes', ['Train', 'Bus', 'Flight']);
  };

  // Generate journey plans
  async function submit(e) {
    e.preventDefault();

    if (form.source.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      setError('Source and destination cannot be the same city. Please choose two different cities.');
      return;
    }

    if (!form.modes.length) {
      setError('Select at least one preferred transport mode (Train, Bus, or Flight).');
      return;
    }

    setBusy(true);
    setError('');
    setNote('');
    setSaveSuccess('');
    setResults([]);

    try {
      const { data } = await api.post('/journeys/plan', form);

      setResults(data.itineraries || []);
      setNote(data.message || '');

      if (!data.itineraries || !data.itineraries.length) {
        setError(data.message || 'No routes found for the selected criteria.');
      }
    } catch (e) {
      setError(
        e.response?.data?.message || 'Journey planning failed. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  // Save a journey
  async function save(item) {
    try {
      await api.post('/journeys/save', {
        ...item,
        input: form
      });

      setSaveSuccess(`Journey from ${item.source} to ${item.destination} saved successfully to your travel history!`);
      setTimeout(() => setSaveSuccess(''), 6000);
    } catch (e) {
      alert(
        e.response?.data?.message || 'Could not save journey.'
      );
    }
  }

  return (
    <main className="page-wrap">
      <div className="page-title">
        <span className="eyebrow"><Sparkles size={14} style={{ display: 'inline', marginRight: 4 }} /> MULTI-MODAL ROUTE PLANNER</span>
        <h1>Where would you like to go?</h1>
        <p>
          Compare complete travel plans across Indian railways, highways and airlines with intermediate connections and optional hotel stays.
        </p>
      </div>

      <form className="planner-panel" onSubmit={submit}>
        <div className="form-grid" style={{ alignItems: 'end' }}>
          <label className="field" style={{ position: 'relative' }}>
            <span><MapPin size={16} /> From (Origin)</span>
            <select
              value={form.source}
              onChange={e => set('source', e.target.value)}
              disabled={citiesLoading}
            >
              {cities.map(c => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name} {c.state ? `(${c.state})` : ''}
                </option>
              ))}
            </select>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="swap-btn"
              onClick={swapCities}
              title="Swap From and To cities"
              aria-label="Swap From and To cities"
              style={{ marginBottom: 18, alignSelf: 'end' }}
            >
              <ArrowLeftRight size={17} />
            </button>

            <label className="field" style={{ flex: 1 }}>
              <span><MapPin size={16} /> To (Destination)</span>
              <select
                value={form.destination}
                onChange={e => set('destination', e.target.value)}
                disabled={citiesLoading}
              >
                {cities.map(c => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name} {c.state ? `(${c.state})` : ''}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span><CalendarDays size={16} /> Journey date</span>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={e => set('date', e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-grid">
          <label className="field">
            <span><Users size={16} /> Travellers</span>
            <input
              type="number"
              min="1"
              max="20"
              value={form.travellers}
              onChange={e => set('travellers', e.target.value)}
            />
          </label>

          <label className="field">
            <span><Wallet size={16} /> Budget per person (₹)</span>
            <input
              type="number"
              min="0"
              step="100"
              value={form.budget}
              onChange={e => set('budget', e.target.value)}
            />
          </label>

          <label className="field">
            <span><SlidersHorizontal size={16} /> Optimization preference</span>
            <select
              value={form.optimization}
              onChange={e => set('optimization', e.target.value)}
            >
              <option value="balanced">Balanced (Optimal time & cost)</option>
              <option value="cheapest">Cheapest (Prioritize lowest fare)</option>
              <option value="fastest">Fastest (Prioritize quickest arrival)</option>
            </select>
          </label>
        </div>

        <div className="field-block">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>Preferred transport modes</b>
            <button
              type="button"
              onClick={selectAllModes}
              style={{
                background: 'none',
                border: 'none',
                color: '#6053e5',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Select all modes
            </button>
          </div>

          <div className="check-row">
            {[
              { id: 'Train', label: 'Train', icon: TrainFront },
              { id: 'Bus', label: 'Bus', icon: Bus },
              { id: 'Flight', label: 'Flight', icon: Plane }
            ].map(({ id, label, icon: Icon }) => (
              <label className="check-pill" key={id} style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.modes.includes(id)}
                  onChange={() => toggle(id)}
                />
                <Icon size={15} color="#6053e5" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Overnight stays</span>
            <select
              value={form.overnightStays}
              onChange={e => set('overnightStays', Number(e.target.value))}
            >
              <option value="0">No overnight stay (Direct / Continuous)</option>
              <option value="1">1 night stay</option>
              <option value="2">2 nights stay</option>
              <option value="3">3 nights stay</option>
            </select>
          </label>

          <label className="field">
            <span>Accommodation location preference</span>
            <select
              value={form.accommodation}
              onChange={e => set('accommodation', e.target.value)}
            >
              <option value="none">No accommodation</option>
              <option value="destination">At destination city</option>
              <option value="intermediate">Intermediate connecting city</option>
              <option value="flexible">Flexible recommendation</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 10 }}>
          <button
            className="btn btn-primary btn-lg"
            type="submit"
            disabled={busy || !form.modes.length}
            style={{ minWidth: 240 }}
          >
            {busy ? 'Searching optimal routes…' : 'Generate journey options'}
          </button>
        </div>

        <p className="sim-note">
          All schedules, fares and hotel availability are generated from RouteRescue’s active transport network.
        </p>
      </form>

      {saveSuccess && (
        <div className="alert success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} />
          <span>{saveSuccess}</span>
        </div>
      )}

      {error && (
        <div className="alert error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {note && !error && (
        <div className="alert success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={18} />
          <span>{note}</span>
        </div>
      )}

      {results.length > 0 && (
        <section className="results-section">
          <div className="section-heading left">
            <span className="eyebrow">FEASIBLE ITINERARIES</span>
            <h2>{results.length} Journey Plans Found for {form.source} → {form.destination}</h2>
            <p>
              Compare complete legs, transfers, duration and costs, then save your preferred route.
            </p>
          </div>

          <ComparisonTable results={results} previousPlan={previousPlan} />

          <div style={{ display: 'grid', gap: 20 }}>
            {results.map((item, i) => (
              <ItineraryCard
                key={item.id}
                item={item}
                index={i}
                onSave={save}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}


function ComparisonTable({ results, previousPlan }) {
  const rows = previousPlan
    ? [previousPlan, ...results]
    : results;

  return (
    <div className="table-scroll compare-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Plan Category</th>
            <th>Route</th>
            <th>Total / Person</th>
            <th>Group Total</th>
            <th>Duration</th>
            <th>Transfers</th>
            <th>Transport Fare</th>
            <th>Accommodation</th>
            <th>Hotel Cost</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item, index) => {
            const saved = previousPlan && index === 0;

            return (
              <tr key={saved ? `saved-${item.id}` : item.id}>
                <td>
                  <b>
                    {saved
                      ? 'Previous Plan'
                      : item.highlights?.join(', ') || item.name}
                  </b>
                </td>

                <td>
                  {[item.source, ...(item.intermediateCities || []), item.destination]
                    .join(' → ')}
                </td>

                <td>
                  <b>{money(item.totalPerPerson)}</b>
                  {item.withinBudget === false && (
                    <small className="over-budget">
                      Over budget
                    </small>
                  )}
                </td>

                <td>{money(item.totalGroupCost)}</td>

                <td>
                  {Number(item.elapsedDurationHours || 0).toFixed(1)} hrs
                </td>

                <td>
                  {item.transfers === 0
                    ? 'Direct'
                    : `${item.transfers} stop(s)`}
                </td>

                <td>{money(item.transportationCostPerPerson)}</td>

                <td>
                  {item.accommodation?.nights
                    ? `${item.accommodation.city} (${item.accommodation.nights} nt)`
                    : 'None'}
                </td>

                <td>{money(item.accommodation?.totalPerPerson)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

