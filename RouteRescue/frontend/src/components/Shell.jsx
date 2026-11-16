import { useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, LogOut, UserRound, Sun, Moon, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const nav = useNavigate();
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="site-nav">
      <Link to="/" className="site-logo">
        <span className="site-logo-mark">
          <Compass size={20} strokeWidth={2.2} />
        </span>
        <span className="site-logo-text">
          <strong className="site-logo-brand">RouteRescue</strong>
          <small className="site-logo-tagline">SMART CORRIDORS · INDIA</small>
        </span>
      </Link>

      <nav className="site-nav-links" aria-label="Main Navigation">
        <Link to="/" className={`nav-tab ${isCurrent('/') ? 'active' : ''}`}>
          <span className="tab-num">00</span>
          <span className="tab-label">Home</span>
        </Link>
        <Link to="/planner" className={`nav-tab ${isCurrent('/planner') ? 'active' : ''}`}>
          <span className="tab-num">01</span>
          <span className="tab-label">Planner</span>
        </Link>
        <Link to="/popular-journeys" className={`nav-tab ${isCurrent('/popular-journeys') ? 'active' : ''}`}>
          <span className="tab-num">02</span>
          <span className="tab-label">Journeys</span>
        </Link>
        <Link to="/destinations" className={`nav-tab ${isCurrent('/destinations') ? 'active' : ''}`}>
          <span className="tab-num">03</span>
          <span className="tab-label">Destinations</span>
        </Link>
        {user && (
          <Link to="/dashboard" className={`nav-tab ${isCurrent('/dashboard') ? 'active' : ''}`}>
            <span className="tab-num">04</span>
            <span className="tab-label">Dashboard</span>
          </Link>
        )}
        {user && (
          <Link to="/history" className={`nav-tab ${isCurrent('/history') ? 'active' : ''}`}>
            <span className="tab-num">05</span>
            <span className="tab-label">Saved</span>
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className={`nav-tab ${isCurrent('/admin') ? 'active' : ''}`}>
            <span className="tab-num">06</span>
            <span className="tab-label">Admin</span>
          </Link>
        )}
      </nav>

      <div className="site-nav-actions">
        <button
          className="theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {theme === 'dark' ? (
            <Sun size={18} className="theme-icon sun-icon" />
          ) : (
            <Moon size={18} className="theme-icon moon-icon" />
          )}
          <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {user ? (
          <div className="user-action-group">
            <span className="user-chip">
              <UserRound size={15} />
              <span>{user.name.split(' ')[0]}</span>
            </span>
            <button
              className="site-logout-btn"
              type="button"
              onClick={() => {
                logout();
                nav('/');
              }}
              title="Sign out of RouteRescue"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link className="site-cta-btn" to="/login">
            <span className="cta-dot">●</span>
            <span>PLAN A TRIP</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="footer-brand-col">
          <div className="site-logo footer-logo">
            <span className="site-logo-mark">
              <Compass size={20} strokeWidth={2.2} />
            </span>
            <span className="site-logo-text">
              <strong className="site-logo-brand">RouteRescue</strong>
              <small className="site-logo-tagline">MULTI-MODAL ENGINE · INDIA</small>
            </span>
          </div>
          <p className="footer-description">
            Precision travel planning across Indian railways, national highways, and domestic flight corridors. Compare complete trips with connections, transfers, and real rupee totals.
          </p>
          <div className="footer-status-pill">
            <span className="status-indicator"></span>
            <span>20 Interconnected Hubs · 3 Optimization Engines</span>
          </div>
        </div>

        <div className="footer-nav-col">
          <h4 className="footer-col-title"><span className="title-num">01</span> Route Planning</h4>
          <Link to="/planner">Interactive Planner</Link>
          <Link to="/popular-journeys">Popular Corridors</Link>
          <Link to="/destinations">Destinations Index</Link>
          <Link to="/history">Saved Itineraries</Link>
        </div>

        <div className="footer-nav-col">
          <h4 className="footer-col-title"><span className="title-num">02</span> Optimization</h4>
          <Link to="/planner">Cheapest Fare Engine</Link>
          <Link to="/planner">Fastest Corridor Match</Link>
          <Link to="/planner">Balanced Transfers</Link>
          <Link to="/feedback">Traveler Feedback</Link>
        </div>

        <div className="footer-nav-col">
          <h4 className="footer-col-title"><span className="title-num">03</span> Account & Access</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/dashboard">Traveler Dashboard</Link>
          <Link to="/admin">Admin Operations</Link>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-copy">© 2026 RouteRescue. Built with Foldline geometric precision.</span>
          <span className="footer-note">Simulated schedule and fare network. Fares shown in INR (₹).</span>
        </div>
      </div>
    </footer>
  );
}

const REVEAL = '.fold-hero, .fold-ticket, .fold-section, .tool-card, .polaroid-card, .hub-badge, .fold-step-card, .planner-panel, .itinerary-card, .stat-card, .admin-panel, .auth-panel';

export function AppLayout({ children }) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const root = document.querySelector('.site-main');
    if (!root) return undefined;
    const nodes = [...root.querySelectorAll(REVEAL)];
    nodes.forEach((node, index) => {
      node.classList.add('reveal');
      node.style.transitionDelay = `${(index % 5) * 60}ms`;
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div className="site-shell">
      <Navbar />
      <div className="site-main" key={pathname}>
        <div className="page-fade">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
