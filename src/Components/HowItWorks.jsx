import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, CalendarCheck, Timer, BookOpen, CheckCircle } from 'lucide-react';

const steps = [
	{
		icon: <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" />,
		title: 'Thapar Students Only',
		description:
			'Sign in securely with your Thapar University Google account to access the booking system.',
	},
	{
		icon: <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />,
		title: 'Choose Your Floor',
		description:
			'Browse real-time seat availability on any floor and pick your preferred study environment.',
	},
	{
		icon: <CalendarCheck className="w-8 h-8 sm:w-10 sm:h-10" />,
		title: 'Book Instantly',
		description:
			'Reserve your seat in just a click. Your spot is held for 10 minutes until you check in.',
	},
	{
		icon: <Timer className="w-8 h-8 sm:w-10 sm:h-10" />,
		title: 'Quick Check-In',
		description:
			'Arrive at the library and confirm your seat within 10 minutes to secure your booking.',
	},
	{
		icon: <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />,
		title: 'Enjoy Your Study Time',
		description:
			'Relax and focus—your seat is guaranteed. Free your seat when done for others to use.',
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
			type: 'spring',
			stiffness: 80,
		},
	}),
};

const HowItWorks = () => {
	const containerRef = useRef(null);

	return (
		<section
			id="howitworks-section"
			ref={containerRef}
			className="w-full py-8 px-2 sm:py-14 sm:px-4 transition-all duration-700"
		>
			<motion.h2
				initial={{ opacity: 0, y: -30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.7 }}
				className="text-xl sm:text-2xl md:text-5xl font-extrabold text-center text-black mb-6 md:mb-10 tracking-tight"
				style={{ fontFamily: "'Poppins', sans-serif" }}
			>
				How <span className="text-blue-700">SitWise</span> Works
			</motion.h2>
			<div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:gap-6 lg:gap-8 justify-center items-center max-w-5xl mx-auto">
				{steps.map((step, i) => (
					<motion.div
						key={i}
						custom={i}
						variants={cardVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						className="relative bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 text-center w-full max-w-xs min-w-0 hover:shadow-2xl transition-all duration-300 group"
						whileHover={{
							scale: 1.04,
							boxShadow: '0 8px 32px 0 rgba(34, 139, 230, 0.18)',
						}}
					>
						<motion.div
							className="flex justify-center mb-4 sm:mb-5"
							initial={{ rotate: -10, scale: 0.9 }}
							whileHover={{ rotate: 8, scale: 1.1 }}
							transition={{ type: 'spring', stiffness: 200, damping: 10 }}
						>
							<div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 sm:p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
								{step.icon}
							</div>
						</motion.div>
						<h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-gray-900">
							{step.title}
						</h3>
						<p className="text-gray-500 text-xs sm:text-sm md:text-base">
							{step.description}
						</p>
						<motion.div
							className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							initial={{ scale: 0 }}
							whileHover={{ scale: 1.1, opacity: 1 }}
						>
							<svg width="32" height="32" fill="none">
								<circle
									cx="16"
									cy="16"
									r="16"
									fill="#3B82F6"
									fillOpacity="0.15"
								/>
							</svg>
						</motion.div>
						<span className="absolute -top-4 -left-4 bg-blue-100 text-blue-700 font-bold rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow text-sm sm:text-base">
							{i + 1}
						</span>
					</motion.div>
				))}
			</div>
		</section>
	);
};

export default HowItWorks;