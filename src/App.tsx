import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import CarDetails from './pages/CarDetails';
import Compare from './pages/Compare';
import TestDrive from './pages/TestDrive';
import Financing from './pages/Financing';
import ElectricCollection from './pages/ElectricCollection';
import PerformanceCollection from './pages/PerformanceCollection';
import About from './pages/About';
import Contact from './pages/Contact';
import Garage from './pages/Garage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/test-drive" element={<TestDrive />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/collection/electric" element={<ElectricCollection />} />
          <Route path="/collection/performance" element={<PerformanceCollection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Fallback route to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
