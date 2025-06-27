import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './pages/Logout';
import Login from './pages/Login';
import Home from './pages/Home'
import PwdReset from './pages/PwdReset';
import Contact from './pages/Contact';
import Request from './pages/Request';
import ControlPanel from './pages/ControlPanel';
import Messages from './pages/Messages';
import Requests from './pages/Requests';
import Conditions from './pages/Conditions';
import Heating from './pages/Heating';
import Planning from './pages/Planning';
import Construction from './pages/Construction';
import Surface from './pages/Surface';
import Locations from './pages/Locations';
import Sectors from './pages/Sectors';
import AdminLand from './pages/AdminLand';
import AdminHouse from './pages/AdminHouse';
import AdminApartments from './pages/AdminApartments';
import AdminSpaces from './pages/AdminSpaces';
import ApartmentDetails from './pages/ApartmentDetails';
import HouseDetails from './pages/HouseDetails';
import SpaceDetails from './pages/SpaceDetails';
import LandDetails from './pages/LandDetails';
import Apartments from './pages/Apartments';
import Houses from './pages/Houses';
import Lands from './pages/Lands';
import Spaces from './pages/Spaces';
import Error from './pages/Error';
import RedirectHandler from './pages/RedirectHandler';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path='/resetare-parola/:uid/:token' element={<PwdReset />} />
      <Route path='/contacte' element={<Contact />} />
      <Route path='/cerere' element={<Request />} />
      <Route path='/404' element={<Error />} />
      <Route path="/:category/:city/:type" element={<RedirectHandler />} />

      <Route path='/utilizatori' element={<ProtectedRoute>
        <ControlPanel />
      </ProtectedRoute>} />
      <Route path='/mesaje' element={<ProtectedRoute>
        <Messages />
      </ProtectedRoute>} />
      <Route path='/cereri' element={<ProtectedRoute>
        <Requests />
      </ProtectedRoute>} />
      <Route path='/conditii' element={<ProtectedRoute>
        <Conditions />
      </ProtectedRoute>} />
      <Route path='/incalzire' element={<ProtectedRoute>
        <Heating />
      </ProtectedRoute>} />
      <Route path='/planificare' element={<ProtectedRoute>
        <Planning />
      </ProtectedRoute>} />
      <Route path='/constructie' element={<ProtectedRoute>
        <Construction />
      </ProtectedRoute>} />
      <Route path='/suprafata' element={<ProtectedRoute>
        <Surface />
      </ProtectedRoute>} />
      <Route path='/locatie' element={<ProtectedRoute>
        <Locations />
      </ProtectedRoute>} />
      <Route path='/sectoare' element={<ProtectedRoute>
        <Sectors />
      </ProtectedRoute>} />
      <Route path='/admin/terenuri' element={<ProtectedRoute>
        <AdminLand />
      </ProtectedRoute>} />
      <Route path='/admin/case' element={<ProtectedRoute>
        <AdminHouse />
      </ProtectedRoute>} />
      <Route path='/admin/apartamente' element={<ProtectedRoute>
        <AdminApartments />
      </ProtectedRoute>} />
      <Route path='/admin/spatii-comerciale' element={<ProtectedRoute>
        <AdminSpaces />
      </ProtectedRoute>} />

      <Route path='/apartamente/:id' element={<ApartmentDetails />} />
      <Route path='/case/:id' element={<HouseDetails />} />
      <Route path='/spatii-comerciale/:id' element={<SpaceDetails />} />
      <Route path='/terenuri/:id' element={<LandDetails />} />

      <Route path='/apartamente' element={<Apartments />} />
      <Route path='/case' element={<Houses />} />
      <Route path='/terenuri' element={<Lands />} />
      <Route path='/spatii-comerciale' element={<Spaces />} />

      <Route path="*" element={<Error />} />
    </Routes>
  );
}
