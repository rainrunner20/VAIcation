import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user?.email) {
        navigate('/create-trip');
        return;
      }
      if (!db) {
        if (active) {
          setError('Configure your Firebase project to load saved trips.');
          setLoading(false);
        }
        return;
      }
      try {
        const records = await getDocs(
          query(collection(db, 'AITrips'), where('userEmail', '==', user.email))
        );
        if (active) setTrips(records.docs.map(doc => doc.data()));
      } catch {
        if (active) setError('Unable to read your saved trips. Check Firestore access.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [navigate]);

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>
      {loading ? (
        <p role="status" className="mt-8">Loading trips…</p>
      ) : error ? (
        <p role="alert" className="mt-8 text-red-600">{error}</p>
      ) : trips.length === 0 ? (
        <p className="mt-8 text-gray-500">No trips saved yet.</p>
      ) : (
        <div className="grid grid-cols-2 mt-10 md:grid-cols-3 gap-5">
          {trips.map(trip => <UserTripCardItem trip={trip} key={trip.id} />)}
        </div>
      )}
    </div>
  );
}
