import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowRight,
  Bus,
  Hotel,
  Plane,
  TrainFront,
  Wallet,
  Route,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Users
} from 'lucide-react';

const CITIES = [
  'Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Vadodara', 'Delhi', 'Jaipur', 'Udaipur',
  'Indore', 'Bhopal', 'Nagpur', 'Hyderabad', 'Bengaluru', 'Chennai', 'Kolkata',
  'Lucknow', 'Prayagraj', 'Varanasi', 'Agra', 'Goa'
];

const JOURNEYS = [
  {
    from: 'Mumbai',
    to: 'Goa',
    duration: '11 hrs',
    tag: 'COASTAL EXPRESS',
    price: '₹1,450',
    meta: 'Konkan corridor · Scenic train or highway sleeper',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=70',
    modes: ['Train', 'Bus']
  },
  {
    from: 'Delhi',
    to: 'Jaipur',
    duration: '4.5 hrs',
    tag: 'PINK CITY RUN',
    price: '₹620',
    meta: 'Heritage corridor · Superfast Shatabdi & AC coaches',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=70',
    modes: ['Train', 'Bus']
  },
  {
    from: 'Bengaluru',
    to: 'Chennai',
    duration: '5 hrs',
    tag: 'SOUTH METRO LINK',
    price: '₹890',
    meta: 'Southern trunk line · High-frequency train corridor',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=70',
    modes: ['Train']
  },
  {
    from: 'Ahmedabad',
    to: 'Udaipur',
    duration: '5.5 hrs',
    tag: 'MEWAR HIGHWAY',
    price: '₹750',
    meta: 'Lake city hop · Luxury highway bus or scenic rail',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=70',
    modes: ['Bus', 'Train']
  }
];

const DESTINATIONS = [
  {
    city: 'Goa',
    line: 'Beaches and a relaxed coastal arrival',
    from: 'Mumbai',
    badge: 'COASTAL',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=70'
  },
  {
    city: 'Jaipur',
    line: 'Forts, bustling bazaars and royal palaces',
    from: 'Delhi',
    badge: 'HERITAGE',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=70'
  },
  {
    city: 'Udaipur',
    line: 'Lakes and palace views in Rajasthan',
    from: 'Ahmedabad',
    badge: 'LAKE CITY',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=70'
  },
  {
    city: 'Varanasi',
    line: 'Ancient ghats and evening aarti on the Ganga',
    from: 'Delhi',
    badge: 'SPIRITUAL',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Boats_at_sunrise_Ganges_River_Varanasi_Uttar_Pradesh_Schwiki.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original'
  },
  {
    city: 'Agra',
    line: 'Taj Mahal and Mughal architecture near Delhi',
    from: 'Delhi',
    badge: 'MONUMENTS',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=70'
  }
];

const TOOLS = [
  {
    icon: Route,
    tag: 'PLANNER',
    title: 'Journey planner',
    text: 'Multi-modal legs with intermediate transfers',
    to: '/planner'
  },
  {
    icon: Wallet,
    tag: 'COMPARE',
    title: 'Cost comparison',
    text: 'Cheapest, fastest and balanced plans',
    to: '/planner'
  },
  {
    icon: Hotel,
    tag: 'STAYS',
    title: 'Overnight stays',
    text: 'Hotel options suggested when layovers demand it',
    to: '/planner'
  },
  {
    icon: TrainFront,
    tag: 'MODES',
    title: 'Rail, road & air',
    text: 'Mix trains, buses and flights seamlessly',
    to: '/planner'
  },
  {
    icon: Bus,
    tag: 'HISTORY',
    title: 'Saved journeys',
    text: 'Reopen, edit or replan past routes anytime',
    to: '/history'
  },
  {
    icon: Plane,
    tag: 'ACCOUNT',
    title: 'Travel preferences',
    text: 'Custom budget per head and preferred modes',
    to: '/profile'
  }
];

function openPlanner(nav, source, destination) {
  const preset = { source, destination };
  sessionStorage.setItem('rr_home_preset', JSON.stringify(preset));
  nav('/planner', { state: { preset, autoPlan: true } });
}

export default function Home() {
  const nav = useNavigate();
  const [source, setSource] = useState('Mumbai');
  const [destination, setDestination] = useState('Goa');
  const [mode, setMode] = useState('Train');
  const [travellers, setTravellers] = useState(1);
  const [formError, setFormError] = useState('');

  function swap() {
    setSource(destination);
    setDestination(source);
  }

  function submit(event) {
    event.preventDefault();
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setFormError('Choose two different cities.');
      return;
    }
    setFormError('');
    sessionStorage.setItem(
      'rr_home_modes',
      JSON.stringify(mode === 'Any' ? ['Train', 'Bus', 'Flight'] : [mode])
    );
    openPlanner(nav, source, destination);
  }

  return (
    <div className="home-foldline">
      {/* ============================================================
          HERO SECTION: Monumental Typography & Interactive Ticket
          ============================================================ */}
      <section className="fold-hero">
        <div className="fold-hero-header">
          <div className="fold-ribbon">
            <span className="ribbon-tag">01</span>
            <span className="ribbon-text">FIRST STEP</span>
          </div>

          <h1 className="fold-hero-title">
            Routes built ,
            <span className="fold-accent-line">for your journey.</span>
          </h1>

          <p className="fold-hero-sub">
            Precision multi-modal route planning across 20 interconnected Indian hubs. Five sample corridors to start with, or calibrate your own journey across railways, highways, and airlines.
          </p>

          <div className="fold-scroll-hint">
            <span className="hint-dot">●</span>
            <span>SCROLL DOWN FOR POPULAR CORRIDORS, DESTINATIONS AND SMART TOOLS</span>
          </div>
        </div>

        {/* ============================================================
            WALKER'S / PASSENGER'S TICKET (Physical Ticket Aesthetic)
            ============================================================ */}
        <div className="fold-ticket-wrapper">
          <div className="fold-ticket">
            {/* Left Main Ticket Body */}
            <div className="ticket-body">
              <div className="ticket-header-row">
                <span className="ticket-badge">ROUTERESCUE PASSENGER TICKET</span>
                <span className="ticket-number">NO. 0601</span>
              </div>

              {/* Mode Tags (Foldline stamp style) */}
              <div className="ticket-modes-row">
                <span className="ticket-field-label">TRANSPORT MODES</span>
                <div className="ticket-stamp-group">
                  {['Train', 'Bus', 'Flight', 'Any'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`ticket-stamp ${mode === item ? 'active' : ''}`}
                      onClick={() => setMode(item)}
                    >
                      {item === 'Train' && <TrainFront size={14} />}
                      {item === 'Bus' && <Bus size={14} />}
                      {item === 'Flight' && <Plane size={14} />}
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Origin / Destination Search */}
              <form className="ticket-form" onSubmit={submit}>
                <div className="ticket-route-grid">
                  <div className="ticket-input-cell">
                    <label htmlFor="origin-select">FROM (ORIGIN)</label>
                    <select
                      id="origin-select"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    >
                      {CITIES.map((city) => (
                        <option key={`src-${city}`} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="ticket-swap-btn"
                    onClick={swap}
                    title="Swap Origin and Destination"
                    aria-label="Swap Origin and Destination"
                  >
                    <ArrowLeftRight size={16} />
                  </button>

                  <div className="ticket-input-cell">
                    <label htmlFor="dest-select">TO (DESTINATION)</label>
                    <select
                      id="dest-select"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      {CITIES.map((city) => (
                        <option key={`dest-${city}`} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Preferences Row: Travellers & Quick Stats */}
                <div className="ticket-meta-row">
                  <div className="ticket-meta-cell">
                    <label htmlFor="traveller-count">TRAVELLERS</label>
                    <div className="ticket-counter">
                      <Users size={14} />
                      <select
                        id="traveller-count"
                        value={travellers}
                        onChange={(e) => setTravellers(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Traveler' : 'Travelers'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="ticket-meta-cell">
                    <label>OPTIMIZATION</label>
                    <div className="ticket-stat-value">
                      <Sparkles size={14} />
                      <span>Cheapest · Fastest · Balanced</span>
                    </div>
                  </div>

                  <button className="ticket-submit-btn" type="submit">
                    <span>GENERATE JOURNEY</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {formError && <p className="ticket-error-msg">{formError}</p>}
              </form>
            </div>

            {/* Perforated Divider */}
            <div className="ticket-perforation">
              <span className="notch-top"></span>
              <div className="perf-line"></div>
              <span className="notch-bottom"></span>
            </div>

            {/* Right Ticket Stub */}
            <div className="ticket-stub">
              <div className="stub-top">
                <span className="stub-index">01</span>
                <h3 className="stub-route-title">
                  {source} <span className="stub-arrow">→</span> {destination}
                </h3>
              </div>

              <div className="stub-details">
                <div className="stub-row">
                  <span className="stub-key">PRIMARY MODE</span>
                  <span className="stub-val">{mode}</span>
                </div>
                <div className="stub-row">
                  <span className="stub-key">NETWORK HUBS</span>
                  <span className="stub-val">20 Cities</span>
                </div>
                <div className="stub-row">
                  <span className="stub-key">OPTIMAL PLANS</span>
                  <span className="stub-val">3 Feasible</span>
                </div>
              </div>

              <button
                type="button"
                className="stub-action-btn"
                onClick={submit}
              >
                <span>OPEN PLANNER</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

  

      {/* ============================================================
          SECTION 02: Three Kinds of Journey / Travel Tools
          ============================================================ */}
      <section className="fold-section">
        <div className="fold-section-header">
          <div className="fold-ribbon">
            <span className="ribbon-tag">02</span>
            <span className="ribbon-text">TRAVEL TOOLS</span>
          </div>
          <h2 className="fold-section-title">
            Three kinds of
            <span className="fold-accent-line"> journey.</span>
          </h2>
          <p className="fold-section-sub">
            We run three distinct routing engines, sorted by your travel priorities. Pick your parameter first, then explore the connections.
          </p>
        </div>

        {/* 3 Signature Optimization Cards */}
        <div className="fold-three-cards-grid">
          <div className="fold-kind-card">
            <div className="kind-header">
              <span className="kind-num">01</span>
              <span className="kind-badge badge-green">BUDGET FIRST</span>
            </div>
            <h3 className="kind-title">Cheapest Fare Route</h3>
            <p className="kind-desc">
              Direct and connected sleeper class railways, ordinary state express buses, and low-cost multi-leg hops designed to maximize your rupee value.
            </p>
            <div className="kind-stats">
              <div>
                <span className="k-stat-label">FARE REDUCTION</span>
                <strong className="k-stat-val">Up to 45%</strong>
              </div>
              <div>
                <span className="k-stat-label">MODE MIX</span>
                <strong className="k-stat-val">Train + Bus</strong>
              </div>
            </div>
            <Link to="/planner" className="kind-link">
              <span>Calibrate budget route</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="fold-kind-card active-card">
            <div className="kind-header">
              <span className="kind-num">02</span>
              <span className="kind-badge badge-red">SPEED FIRST</span>
            </div>
            <h3 className="kind-title">Fastest Corridor</h3>
            <p className="kind-desc">
              Non-stop domestic flights, premium high-speed Vande Bharat and Rajdhani express trains with zero unnecessary layovers.
            </p>
            <div className="kind-stats">
              <div>
                <span className="k-stat-label">TIME SAVED</span>
                <strong className="k-stat-val">Up to 60%</strong>
              </div>
              <div>
                <span className="k-stat-label">MODE MIX</span>
                <strong className="k-stat-val">Air + Rail</strong>
              </div>
            </div>
            <Link to="/planner" className="kind-link">
              <span>Calibrate speed route</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="fold-kind-card">
            <div className="kind-header">
              <span className="kind-num">03</span>
              <span className="kind-badge badge-blue">BALANCED</span>
            </div>
            <h3 className="kind-title">Practical Harmony</h3>
            <p className="kind-desc">
              The pragmatic sweet spot between ticket price, connection comfort, daylight arrival, and verified overnight hotel options.
            </p>
            <div className="kind-stats">
              <div>
                <span className="k-stat-label">LAYOVER TIME</span>
                <strong className="k-stat-val">&lt; 3 Hours</strong>
              </div>
              <div>
                <span className="k-stat-label">MODE MIX</span>
                <strong className="k-stat-val">Multi-Modal</strong>
              </div>
            </div>
            <Link to="/planner" className="kind-link">
              <span>Calibrate balanced route</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 6 Sub-Tools */}
        <div className="fold-tools-grid">
          {TOOLS.map((tool) => (
            <Link key={tool.title} to={tool.to} className="tool-card">
              <div className="tool-card-top">
                <span className="tool-icon-box">
                  <tool.icon size={18} />
                </span>
                <span className="tool-tag">{tool.tag}</span>
              </div>
              <h4 className="tool-title">{tool.title}</h4>
              <p className="tool-text">{tool.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 03: Popular Journeys (Foldline Polaroid Card Style)
          ============================================================ */}
      <section className="fold-section">
        <div className="fold-section-header">
          <div className="fold-ribbon">
            <span className="ribbon-tag">03</span>
            <span className="ribbon-text">POPULAR CORRIDORS</span>
          </div>
          <div className="fold-header-split">
            <div>
              <h2 className="fold-section-title">
                Routes travellers
                <span className="fold-accent-line"> take most.</span>
              </h2>
              <p className="fold-section-sub">
                Curated sample corridors connecting premier metropolitan hubs with coastal and cultural destinations.
              </p>
            </div>
            <Link to="/popular-journeys" className="fold-section-cta">
              <span>View all corridors</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Polaroid Photo Cards */}
        <div className="polaroid-grid">
          {JOURNEYS.map((trip) => (
            <div
              key={`${trip.from}-${trip.to}`}
              className="polaroid-card"
              onClick={() => openPlanner(nav, trip.from, trip.to)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openPlanner(nav, trip.from, trip.to);
              }}
            >
              {/* Simulated Masking Tape */}
              <div className="polaroid-tape"></div>

              <div className="polaroid-photo-frame">
                <img
                  src={trip.image}
                  alt={`${trip.from} to ${trip.to}`}
                  className="polaroid-img"
                  loading="lazy"
                />
                <span className="polaroid-pill">{trip.tag}</span>
              </div>

              <div className="polaroid-content">
                <h3 className="polaroid-title">
                  {trip.from} → {trip.to}
                </h3>
                <p className="polaroid-meta">{trip.meta}</p>

                <div className="polaroid-stats-row">
                  <div className="p-stat">
                    <Clock size={12} />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="p-stat">
                    <TrainFront size={12} />
                    <span>{trip.modes.join(' & ')}</span>
                  </div>
                  <div className="p-stat price-stat">
                    <span>{trip.price}</span>
                  </div>
                </div>

                <div className="polaroid-action">
                  <span>Plan this journey</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 04: Destinations & Hubs
          ============================================================ */}
      <section className="fold-section">
        <div className="fold-section-header">
          <div className="fold-ribbon">
            <span className="ribbon-tag">04</span>
            <span className="ribbon-text">DESTINATIONS</span>
          </div>
          <div className="fold-header-split">
            <div>
              <h2 className="fold-section-title">
                Every destination
                <span className="fold-accent-line"> has a starting hub.</span>
              </h2>
              <p className="fold-section-sub">
                Select an arrival city to automatically calibrate the optimal origin and transport modes.
              </p>
            </div>
            <Link to="/destinations" className="fold-section-cta">
              <span>Explore all destinations</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="destinations-fold-grid">
          {DESTINATIONS.map((place) => (
            <div
              key={place.city}
              className="hub-badge-card"
              onClick={() => openPlanner(nav, place.from, place.city)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') openPlanner(nav, place.from, place.city);
              }}
            >
              <div className="hub-photo-wrap">
                <img src={place.image} alt={place.city} className="hub-photo" loading="lazy" />
                <span className="hub-cat-tag">{place.badge}</span>
              </div>
              <div className="hub-card-info">
                <div className="hub-top-line">
                  <h4 className="hub-name">{place.city}</h4>
                  <span className="hub-origin-tag">from {place.from}</span>
                </div>
                <p className="hub-desc">{place.line}</p>
                <div className="hub-action-link">
                  <span>Launch corridor</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 05: How It Works (Three Steps)
          ============================================================ */}
      <section className="fold-section fold-steps-section">
        <div className="fold-section-header">
          <div className="fold-ribbon">
            <span className="ribbon-tag">05</span>
            <span className="ribbon-text">HOW IT WORKS</span>
          </div>
          <h2 className="fold-section-title">
            Pick your cities.
            <span className="fold-accent-line"> We do the routing.</span>
          </h2>
          <p className="fold-section-sub">
            Three straightforward steps from selecting your origin to getting a verified, multi-modal travel itinerary.
          </p>
        </div>

        <div className="fold-steps-grid">
          <div className="fold-step-card">
            <div className="step-num-badge">01</div>
            <h3 className="step-card-title">Choose Origin & Destination</h3>
            <p className="step-card-text">
              Select any of the 20 major Indian transit cities. Pick your preferred transport mix—train, bus, or domestic flight.
            </p>
            <div className="step-foot-line">
              <CheckCircle2 size={15} />
              <span>Direct and connected legs</span>
            </div>
          </div>

          <div className="fold-step-card">
            <div className="step-num-badge">02</div>
            <h3 className="step-card-title">Compare Three Generated Plans</h3>
            <p className="step-card-text">
              Review side-by-side itineraries: cheapest fares, fastest travel hours, and balanced schedules with transparent rupee breakdowns.
            </p>
            <div className="step-foot-line">
              <CheckCircle2 size={15} />
              <span>Real transfer times & stays</span>
            </div>
          </div>

          <div className="fold-step-card">
            <div className="step-num-badge">03</div>
            <h3 className="step-card-title">Save, Replan & Travel</h3>
            <p className="step-card-text">
              Save your preferred itinerary to your traveler history with one click. Replan anytime as dates or budgets change.
            </p>
            <div className="step-foot-line">
              <CheckCircle2 size={15} />
              <span>Full traveler persistence</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
