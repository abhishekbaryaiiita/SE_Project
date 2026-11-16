import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  Star,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const POPULAR_DESTINATIONS = [
  {
    city: 'Goa',
    state: 'Goa',
    line: 'Beaches, coastal cuisine & relaxed tropical vibes',
    from: 'Mumbai',
    altFrom: 'Pune',
    bestTime: 'Nov – Feb',
    type: 'Coastal',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=70',
    highlights: ['Calangute & Anjuna Beaches', 'Old Goa Portuguese Cathedrals', 'Dudhsagar Waterfalls', 'Sunset River Cruises']
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    line: 'Forts, palaces and vibrant pink sandstone bazaars',
    from: 'Delhi',
    altFrom: 'Ahmedabad',
    bestTime: 'Oct – Mar',
    type: 'Heritage',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=70',
    highlights: ['Amber Fort & Sheesh Mahal', 'Hawa Mahal & City Palace', 'Nahargarh Fort Sunsets', 'Johari Bazaar Crafts']
  },
  {
    city: 'Udaipur',
    state: 'Rajasthan',
    line: 'Lakes, palace views and romantic heritage retreats',
    from: 'Ahmedabad',
    altFrom: 'Jaipur',
    bestTime: 'Sep – Mar',
    type: 'Heritage',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=70',
    highlights: ['Lake Pichola Boat Rides', 'City Palace Complex', 'Jagmandir Island', 'Saheliyon-ki-Bari']
  },
  {
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    line: 'Ancient ghats on the sacred river Ganga',
    from: 'Delhi',
    altFrom: 'Lucknow',
    bestTime: 'Oct – Mar',
    type: 'Spiritual',
    rating: 4.8,
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Boats_at_sunrise_Ganges_River_Varanasi_Uttar_Pradesh_Schwiki.jpg',
    highlights: ['Dashashwamedh Ghat Ganga Aarti', 'Kashi Vishwanath Temple', 'Sunrise Boat Ride', 'Sarnath Buddhist Stupa']
  },
  {
    city: 'Agra',
    state: 'Uttar Pradesh',
    line: 'Home of the timeless Taj Mahal and Mughal grandeur',
    from: 'Delhi',
    altFrom: 'Jaipur',
    bestTime: 'Oct – Mar',
    type: 'Heritage',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=70',
    highlights: ['Taj Mahal at Sunrise', 'Agra Fort Red Sandstone Citadel', 'Fatehpur Sikri', 'Mehtab Bagh Views']
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    line: 'Silicon Valley of India with pleasant year-round gardens',
    from: 'Chennai',
    altFrom: 'Hyderabad',
    bestTime: 'Year-round',
    type: 'Metropolitan',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=70',
    highlights: ['Lalbagh Botanical Garden', 'Cubbon Park & Vidhana Soudha', 'Bangalore Palace', 'Craft Breweries & Cafes']
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    line: 'City of Joy, colonial architecture and rich literary culture',
    from: 'Varanasi',
    altFrom: 'Chennai',
    bestTime: 'Oct – Feb',
    type: 'Cultural',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=900&q=70',
    highlights: ['Victoria Memorial Hall', 'Howrah Bridge on Hooghly River', 'Park Street Food Culture', 'Dakshineswar Temple']
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    line: 'Historic Charminar, Nizami culinary heritage & tech hubs',
    from: 'Pune',
    altFrom: 'Bengaluru',
    bestTime: 'Oct – Mar',
    type: 'Heritage',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=70',
    highlights: ['Charminar & Laad Bazaar', 'Golconda Fort Sound & Light', 'Hussain Sagar Lake', 'Authentic Hyderabadi Biryani']
  }
];

export default function Destinations() {
  const nav = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filtered = POPULAR_DESTINATIONS.filter(item => {
    const matchesSearch =
      item.city.toLowerCase().includes(search.toLowerCase()) ||
      item.state.toLowerCase().includes(search.toLowerCase()) ||
      item.line.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      selectedType === 'All' || item.type === selectedType;

    return matchesSearch && matchesType;
  });

  const planTripTo = (destination, fromCity) => {
    const preset = { source: fromCity, destination };
    sessionStorage.setItem('rr_home_preset', JSON.stringify(preset));
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
        <span className="eyebrow"><Compass size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> TRAVEL INSPIRATION</span>
        <h1>Popular Destinations in India</h1>
        <p>
          Explore iconic cities, best times to visit, top attractions, and jump right into planning your journey with sensible origins.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="planner-panel" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder="Search destination or state (e.g. Goa, Rajasthan, Jaipur)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {['All', 'Heritage', 'Coastal', 'Spiritual', 'Metropolitan', 'Cultural'].map(type => (
              <button
                key={type}
                type="button"
                className={`btn btn-sm ${selectedType === type ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
        {filtered.map(dest => (
          <article
            key={dest.city}
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
                height: 190,
                backgroundImage: `linear-gradient(180deg, rgba(8,15,30,0.2) 0%, rgba(8,15,30,0.88) 100%), url(${dest.image})`,
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
                  {dest.type}
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 8px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#facc15'
                  }}
                >
                  <Star size={13} fill="#facc15" /> {dest.rating}
                </span>
              </div>

              <div>
                <h3 style={{ margin: '0 0 2px', color: '#fff', fontSize: 24 }}>
                  {dest.city}
                </h3>
                <small style={{ color: '#d5deea', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} /> {dest.state}, India
                </small>
              </div>
            </div>

            <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', margin: '0 0 10px' }}>
                  {dest.line}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Calendar size={14} /> Best: <b>{dest.bestTime}</b>
                  </span>
                  <span>
                    Suggested Hub: <b>{dest.from}</b>
                  </span>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    Top Attractions
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {dest.highlights.map(h => (
                      <span key={h} style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <CheckCircle2 size={12} color="#16a36a" /> {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => planTripTo(dest.city, dest.from)}
                >
                  Plan from {dest.from} <ArrowRight size={14} />
                </button>
                {dest.altFrom && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => planTripTo(dest.city, dest.altFrom)}
                    title={`Plan from ${dest.altFrom}`}
                  >
                    from {dest.altFrom}
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <MapPin size={32} />
          <h3>No matching destinations found</h3>
          <p>Try searching with another keyword or resetting the filter.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSearch('');
              setSelectedType('All');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
