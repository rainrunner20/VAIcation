import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';

export default function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const location = trip?.userSelection?.location?.label;

  useEffect(() => {
    let active = true;
    if (!location || !import.meta.env.VITE_GOOGLE_PLACE_API_KEY) return undefined;
    async function loadPhoto() {
      try {
        const result = await GetPlaceDetails({ textQuery: location });
        const name = result.data?.places?.[0]?.photos?.[0]?.name;
        if (active && name) {
          setPhotoUrl(PHOTO_REF_URL.replace('{NAME}', encodeURIComponent(name)));
        }
      } catch {
        // A missing or blocked Places photo does not prevent the itinerary loading.
      }
    }
    void loadPhoto();
    return () => { active = false; };
  }, [location]);

  return (
    <div>
      <img src={photoUrl || '/placeholder.jpg'}
        alt={location ? 'Travel overview for ' + location : 'Trip placeholder'}
        className="h-[340px] w-full object-cover rounded-xl" />
      <div className="my-5 flex flex-col gap-2">
        <h2 className="font-bold text-2xl">{location}</h2>
        <div className="flex flex-wrap gap-3">
          <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-600">
            📅 {trip?.userSelection?.noOfDays} days
          </span>
          <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-600">
            💰 {trip?.userSelection?.budget} budget
          </span>
          <span className="p-1 px-3 bg-gray-200 rounded-full text-gray-600">
            🧳 {trip?.userSelection?.traveler}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          AI-generated recommendations are suggestions, not verified bookings, prices, or opening hours.
        </p>
      </div>
    </div>
  );
}
