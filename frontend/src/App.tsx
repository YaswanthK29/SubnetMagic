import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SubnetCalculator from './pages/SubnetCalculator';
import VLSMPage from './pages/VLSMPage';
import WildcardPage from './pages/WildcardPage';
import QuizPage from './pages/QuizPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<SubnetCalculator />} />
          <Route path="/vlsm" element={<VLSMPage />} />
          <Route path="/wildcard" element={<WildcardPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
