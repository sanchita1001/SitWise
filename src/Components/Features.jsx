import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';

const features = [
  {
    icon: <Clock className="w-10 h-10 text-blue-500" />,
    title: '5-Minute Booking',
    description: 'Reserve your seat just 5 minutes before arrival',
  },
  {
    icon: <MapPin className="w-10 h-10 text-blue-500" />,
    title: '5 Floors Available',
    description: 'Choose from multiple floors to find your perfect study environment',
  },
  {
    icon: <Users className="w-10 h-10 text-blue-500" />,
    title: 'Real-Time Updates',
    description: 'See live seat availability and make informed choices',
  },
];

const Features = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 py-12 px-4 bg-white">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 text-center w-72 hover:shadow-lg transition-all"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-full bg-opacity-10">
              {feature.icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-500 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;