import React, { useRef } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Clock className="w-10 h-10" />,
    title: '10-Minute Booking',
    description: 'Reserve your seat just 10 minutes before arrival',
  },
  {
    icon: <MapPin className="w-10 h-10" />,
    title: '2 Floors Available',
    description: 'Choose from multiple floors to find your perfect study environment',
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: 'Real-Time Updates',
    description: 'See live seat availability and make informed choices',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.18,
      duration: 0.7,
      type: "spring",
      stiffness: 80,
    },
  }),
};

const Features = () => {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="w-full py-10 px-2 sm:py-14 sm:px-4 transition-all duration-700"
    >
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-2xl md:text-5xl font-extrabold text-center text-black mb-8 md:mb-10 tracking-tight"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Why Choose <span className="text-blue-700 text-2xl md:text-5xl font-extrabold">SitWise?</span>
      </motion.h2>
      <div className="flex flex-col gap-8 md:flex-row md:gap-6 lg:gap-8 justify-center items-center max-w-5xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center w-full max-w-xs min-w-0 hover:shadow-2xl transition-all duration-300 group"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 8px 32px 0 rgba(34, 139, 230, 0.18)",
            }}
          >
            <motion.div
              className="flex justify-center mb-5"
              initial={{ rotate: -10, scale: 0.9 }}
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
            </motion.div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
            <p className="text-gray-500 text-sm sm:text-base">{feature.description}</p>
            <motion.div
              className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.1, opacity: 1 }}
            >
              <svg width="32" height="32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#3B82F6" fillOpacity="0.15" />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;