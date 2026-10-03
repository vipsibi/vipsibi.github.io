import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HotelList from './pages/HotelList';
import HotelForm from './pages/HotelForm';
import HotelDetail from './pages/HotelDetail';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/hotels/add" element={<HotelForm />} />
        <Route path="/hotels/:slug" element={<HotelDetail />} />
        <Route path="/hotels/:id/edit" element={<HotelForm />} />
      </Routes>
    </Layout>
  );
}