import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

export default function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [status, setStatus] = useState('Loading trip…');

  useEffect(() => {
    let active = true;
    async function loadTrip() {
      if (!db) {
        if (active) setStatus('Firestore is not configured for this demo.');
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, 'AITrips', tripId));
        if (!active) return;
        if (snapshot.exists()) {
          setTrip(snapshot.data());
          setStatus('');
        } else {
          setStatus('This trip was not found.');
        }
      } catch {
        if (active) setStatus('Could not load this trip. Check your account and permissions.');
      }
    }
    if (tripId) void loadTrip();
    return () => { active = false; };
  }, [tripId]);

  if (!trip) return <p role="status" className="mx-auto max-w-3xl p-10">{status}</p>;

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <InfoSection trip={trip} />
      <Hotels trip={trip} />
      <PlacesToVisit trip={trip} />
      <Footer trip={trip} />
    </div>
  );
}
