import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './styles/app.css';

// Importa tus páginas y componentes principales
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Roadmap from './pages/Roadmap';
import GeneratedRoadmap from './pages/GeneratedRoadmap';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Pricing from './pages/Pricing';
import RoadmapsSection from './pages/roadmapsCreados';
import Questions from './pages/Questions';
import Blog from './pages/Blog';
import PaymentFailure from './pages/PaymentFailure';
import PaymentSuccess from './pages/PaymentSuccess';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #835bfc'
          },
          success: {
            iconTheme: {
              primary: '#835bfc',
              secondary: '#fff',
            },
          }
        }}
      />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            

            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
            <Route path="/generatedRoadmap" element={<ProtectedRoute><GeneratedRoadmap /></ProtectedRoute>} />

            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />

            <Route path="/roadmapsCreados" element={<ProtectedRoute><RoadmapsSection /></ProtectedRoute>} />
            <Route path='/questions' element={<ProtectedRoute><Questions /></ProtectedRoute>} />
            <Route path="/pricing/failure" element={<ProtectedRoute><PaymentFailure /></ProtectedRoute>} />
            <Route path="/pricing/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
