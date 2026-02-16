import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestHelp from './pages/RequestHelp';
import Analytics from './pages/Analytics';
import TrackDelivery from './pages/TrackDelivery';
import AIPrioritization from './pages/AIPrioritization';
import AuditLogs from './pages/AuditLogs';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track-delivery" element={<TrackDelivery />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-strategy" element={<AIPrioritization />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/request-help" element={<RequestHelp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
