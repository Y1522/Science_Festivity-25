import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import MapPage from './pages/MapPage'
import TentPage from './pages/TentPage'
import BoothPage from './pages/BoothPage'
import VenuePage from './pages/VenuePage'
import AboutPage from './pages/AboutPage'
import EventsPage from './pages/EventsPage'
import TodayPage from './pages/TodayPage'
import ChatWidget from './components/ChatWidget'
import TentLayoutCalibrator from './components/TentLayoutCalibrator'
import { LangProvider } from './lib/langContext'

export default function App() {
  return (
    <LangProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/tent/:tentId" element={<TentPage />} />
        <Route path="/booth/:boothId" element={<BoothPage />} />
        {/* MapPage links to these three venue cards */}
        <Route path="/conference" element={<VenuePage venue="hall" />} />
        <Route path="/outdoor" element={<VenuePage venue="stage" />} />
        <Route path="/small-theater" element={<VenuePage venue="small-theater" />} />
        {/* DEV-ONLY: booth layout calibrator — شيلي السطر ده قبل النشر */}
        <Route path="/calibrate" element={<TentLayoutCalibrator />} />
      </Routes>
      <ChatWidget />
    </LangProvider>
  )
}
