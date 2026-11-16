import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrainFront,
  Plane,
  Bus,
  Search,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  TrendingUp,
  Compass
} from 'lucide-react';

export const POPULAR_ROUTES = [
  {
    id: 'mumbai-goa',
    from: 'Mumbai',
    to: 'Goa',
    meta: 'Coastal Corridor · Train, Bus, Flight',
    modes: ['Train', 'Bus', 'Flight'],
    duration: '10 hrs train · 1.2 hrs flight',
    startingFare: 750,
    category: 'Coastal',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=70',
    description: 'Breathtaking Konkan coast railway & scenic highways leading to tropical beaches and vibrant nightlife.'
  },
  {
    id: 'delhi-jaipur',
    from: 'Delhi',
    to: 'Jaipur',
    meta: 'Pink City Run · Express Train & Highway',
    modes: ['Train', 'Bus'],
    duration: '4.5 hrs train · 5 hrs bus',
    startingFare: 450,
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=70',
    description: 'Quick escape to royal palaces, magnificent forts, and colorful bazaars of Rajasthan.'
  },
  {
    id: 'bengaluru-chennai',
    from: 'Bengaluru',
    to: 'Chennai',
    meta: 'Southern Tech-Corridor · Vande Bharat & Shatabdi',
    modes: ['Train', 'Bus', 'Flight'],
    duration: '4.5 hrs train · 6 hrs bus',
    startingFare: 420,
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=70',
    description: 'High-speed link between South India’s major economic and cultural powerhouses.'
  },
  {
    id: 'ahmedabad-udaipur',
    from: 'Ahmedabad',
    to: 'Udaipur',
    meta: 'Lake City Express · Bus & Train',
    modes: ['Bus', 'Train'],
    duration: '5 hrs bus · 6 hrs train',
    startingFare: 550,
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=70',
    description: 'Scenic journey through the Aravalli hills straight into the romantic City of Lakes.'
  },
  {
    id: 'delhi-varanasi',
    from: 'Delhi',
    to: 'Varanasi',
    meta: 'Spiritual Expressway · Vande Bharat & Flight',
    modes: ['Train', 'Flight'],
    duration: '8 hrs train · 1.4 hrs flight',
    startingFare: 780,
    category: 'Spiritual',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Boats_at_sunrise_Ganges_River_Varanasi_Uttar_Pradesh_Schwiki.jpg',
    description: 'Direct route to ancient ghats, spiritual ceremonies, and eternal Ganges traditions.'
  },
  {
    id: 'mumbai-ahmedabad',
    from: 'Mumbai',
    to: 'Ahmedabad',
    meta: 'Western Business Line · High-speed corridor',
    modes: ['Train', 'Flight'],
    duration: '5.5 hrs train · 1.2 hrs flight',
    startingFare: 650,
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=70',
    description: 'Premier western commercial artery with frequent luxury express trains and hourly flights.'
  },
  {
    id: 'pune-goa',
    from: 'Pune',
    to: 'Goa',
    meta: 'Ghats & Coastways · Overnight Bus & Rail',
    modes: ['Bus', 'Train'],
    duration: '10 hrs bus · 11 hrs train',
    startingFare: 750,
    category: 'Coastal',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=70',
    description: 'Western Ghats mountain pass into lush sunshine, spice plantations, and golden sandy beaches.'
  },
  {
    id: 'delhi-agra',
    from: 'Delhi',
    to: 'Agra',
    meta: 'Yamuna Expressway & Gatimaan Express',
    modes: ['Train', 'Bus'],
    duration: '1.6 hrs train · 3 hrs bus',
    startingFare: 250,
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=70',
    description: 'Superfast day-trip connection to the Taj Mahal and Mughal imperial architecture.'
  }
];

export default function PopularJourneys() {
  const nav = useNavigate();
  const [search, setSearch] = useState('');
  const [activeMode, setActiveMode] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = POPULAR_ROUTES.filter(route => {
    const matchesSearch =
      route.from.toLowerCase().includes(search.toLowerCase()) ||
      route.to.toLowerCase().includes(search.toLowerCase()) ||
      route.meta.toLowerCase().includes(search.toLowerCase());

    const matchesMode =
      activeMode === 'All' || route.modes.includes(activeMode);

    const matchesCategory =
      activeCategory === 'All' || route.category === activeCategory;

    return matchesSearch && matchesMode && matchesCategory;
  });

  const handlePlanRoute = (source, destination, modes = ['Train', 'Bus', 'Flight']) => {
    const preset = { source, destination };
    sessionStorage.setItem('rr_home_preset', JSON.stringify(preset));
    sessionStorage.setItem('rr_home_modes', JSON.stringify(modes));
    nav('/planner', {
      state: {
        preset,
        autoPlan: true
      }
    });
  };

  return (
    <main className="page-wrap">
      <div className="page-title">
        <span className="eyebrow"><Compass size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> POPULAR CORRIDORS</span>
        <h1>Popular Journeys Across India</h1>
        <p>
          Discover traveller-favorite routes, multimodal schedules, starting fares, and plan your journey in one click.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="planner-panel" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 15, top: 4, color: 'black' }} />
            <input
              type="text"
              placeholder="Search by city"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {['All', 'Train', 'Flight', 'Bus'].map(m => (
              <button
                key={m}
                type="button"
                className={`btn btn-sm ${activeMode === m ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveMode(m)}
              >
                {m === 'Train' && <TrainFront size={14} />}
                {m === 'Flight' && <Plane size={14} />}
                {m === 'Bus' && <Bus size={14} />}
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Category:</span>
          {['All', 'Heritage', 'Coastal', 'Business', 'Spiritual'].map(cat => (
            <button
              key={cat}
              type="button"
              className={`tag ${activeCategory === cat ? 'active' : ''}`}
              style={{
                cursor: 'pointer',
                border: activeCategory === cat ? '1px solid #6053e5' : '1px solid transparent',
                background: activeCategory === cat ? '#f3f1ff' : undefined,
                color: activeCategory === cat ? '#6053e5' : undefined,
                fontWeight: activeCategory === cat ? 700 : 500
              }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Routes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {filtered.map(route => (
          <article
            key={route.id}
            className="itinerary-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: 0
            }}
          >
            <div
              style={{
                height: 170,
                backgroundImage: `linear-gradient(180deg, rgba(8,15,30,0.2) 0%, rgba(8,15,30,0.85) 100%), url(${route.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700
                  }}
                >
                  {route.category}
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, background: '#6053e5', padding: '4px 10px', borderRadius: 999 }}>
                  From ₹{route.startingFare}
                </span>
              </div>

              <div>
                <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: 20 }}>
                  {route.from} <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> {route.to}
                </h3>
                <small style={{ color: '#d5deea', fontSize: 12 }}>{route.meta}</small>
              </div>
            </div>

            <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 14px' }}>
                {route.description}
              </p>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={14} /> {route.duration}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  {route.modes.map(m => (
                    <span
                      key={m}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'rgba(96, 83, 229, 0.1)',
                        color: '#6053e5'
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  onClick={() => handlePlanRoute(route.from, route.to, route.modes)}
                >
                  Plan this journey <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Compass size={32} />
          <h3>No matching journeys found</h3>
          <p>Try modifying your search or transport mode filter.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSearch('');
              setActiveMode('All');
              setActiveCategory('All');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
