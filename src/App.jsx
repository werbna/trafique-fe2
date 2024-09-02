import { useState, createContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import TripsList from './components/TripsList/TripsList';
import TripDetails from './components/TripDetails.jsx/TripDetails';
import TripForm from './components/TripForm/TripForm';
import * as authService from '../src/services/authService';
import * as tripService  from '../src/services/tripService';

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const  [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  const handleAddTrip = async (tripFormData) => {
    const newTrip =  await tripService.createTrip(tripFormData);
    setTrips([...trips, newTrip]);
    navigate('/trips')
  }

  const handleDeleteTrip = async (tripId) => {
    console.log('tripId', tripId)
    setTrips(trips.filter((trip) => trip._id !== tripId))
    navigate('/trips')
  }

  useEffect(() => {
    const fetchAllTrips = async () => {
      const tripsData = await tripService.index();
      setTrips(tripsData)
    }
    if (user) fetchAllTrips();
  },[user])

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            <>
            <Route path='/' element={<Dashboard user={user} />} />
            <Route path='/Trips' element={<TripsList trips={trips} />} />
            <Route path="/Trips/New" element={<TripForm handleAddTrip={handleAddTrip} />} />
            <Route path='/Trips/:tripId' element={<TripDetails handleDeleteTrip={handleDeleteTrip} />} />
            </>
          ) : (
            <Route path='/' element={<Landing />} />
          )}
          <Route path='/signup' element={<SignupForm setUser={setUser} />} />
          <Route path='/signin' element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
