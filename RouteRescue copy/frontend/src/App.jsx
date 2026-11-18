import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/Shell';
import Protected from './components/Protected';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import { Login, Register } from './pages/Auth';
import Planner from './pages/Planner';
import PopularJourneys from './pages/PopularJourneys';
import Destinations from './pages/Destinations';
import Dashboard from './pages/Dashboard';
import { History, ItineraryDetail, Profile, Feedback } from './pages/Pages';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/popular-journeys" element={<PopularJourneys />} />
              <Route path="/destinations" element={<Destinations />} />

              {/* Authenticated Routes */}
              <Route element={<Protected />}>
                <Route path="/planner" element={<Planner />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/itinerary" element={<ItineraryDetail />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/feedback" element={<Feedback />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<Protected admin />}>
                <Route path="/admin" element={<Admin />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </AppLayout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
