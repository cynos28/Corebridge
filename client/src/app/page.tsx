'use client'; // Required for client-side features like Framer Motion

import { motion } from 'framer-motion';

// Animation variants for different elements
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const floatVariants = {
  float: {
    y: [0, -15, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function Page() {
  return (
    <div className="bg-[#F5F7FA] flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-md">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-3xl font-bold text-[#4A90E2]">Corebridge</div>
        </motion.div>
        <div className="flex space-x-6">
          {['Features', 'Testimonials', 'Pricing', 'Contact'].map((item) => (
            <motion.a
              key={item}
              href="#"
              className="text-[#4A90E2] hover:text-[#50C878] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.a>
          ))}
          <motion.a
            href="#"
            className="text-[#4A90E2] border border-[#4A90E2] px-4 py-2 rounded-full hover:bg-[#4A90E2] hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign in
          </motion.a>
          <motion.a
            href="#"
            className="bg-[#50C878] text-white px-4 py-2 rounded-full hover:bg-[#4A90E2] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 relative overflow-hidden bg-gradient-to-br from-[#F5F7FA] to-[#E6F0FA]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background Decorative Elements */}
        <motion.div
          className="absolute top-10 left-10 bg-[#FFD700] opacity-20 w-72 h-72 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 bg-[#50C878] opacity-20 w-72 h-72 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 bg-white p-4 rounded-lg shadow-lg"
          variants={floatVariants}
          animate="float"
        >
          <div className="text-sm text-[#333333]">
            <p className="font-semibold">Class Schedule</p>
            <p>Math - Grade 5</p>
            <p className="text-xs text-gray-500">9:00 AM - 10:00 AM</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-40 right-20 bg-white p-4 rounded-lg shadow-lg"
          variants={floatVariants}
          animate="float"
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-[#333333]">
            <p className="font-semibold">Parent-Teacher Meeting</p>
            <p>Discuss student progress</p>
            <p className="text-xs text-gray-500">3:00 PM - 4:00 PM</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-20 bg-white p-4 rounded-lg shadow-lg"
          variants={floatVariants}
          animate="float"
          transition={{ delay: 1 }}
        >
          <div className="text-sm text-[#333333]">
            <p className="font-semibold">Assignments Due</p>
            <p>Science Project - 80%</p>
            <p>History Essay - 20%</p>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-[#4A90E2] mb-4"
          variants={itemVariants}
        >
          Manage Your School
        </motion.h1>
        <motion.h2
          className="text-3xl md:text-5xl text-[#333333] mb-6"
          variants={itemVariants}
        >
          Seamlessly, All in One Place
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-8 max-w-2xl"
          variants={itemVariants}
        >
          Streamline class schedules, track student progress, communicate with parents, and manage school operations with Corebridge.
        </motion.p>
        <motion.button
          className="bg-[#50C878] text-white px-8 py-3 rounded-full text-lg hover:bg-[#4A90E2] transition-all"
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Free Trial
        </motion.button>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <motion.h2
          className="text-4xl font-bold text-center text-[#4A90E2] mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Why Choose Corebridge?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: 'Class Management',
              description: 'Organize schedules, assign teachers, and manage classrooms effortlessly.',
              icon: '📅',
            },
            {
              title: 'Student Progress',
              description: 'Track grades, attendance, and performance with detailed reports.',
              icon: '📊',
            },
            {
              title: 'Parent Communication',
              description: 'Keep parents informed with updates, messages, and meeting schedules.',
              icon: '📩',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#E6F0FA] to-[#F5F7FA]">
        <motion.h2
          className="text-4xl font-bold text-center text-[#4A90E2] mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: 'Mrs. Johnson, Principal',
              quote: 'Corebridge has transformed how we manage our school. It’s intuitive and saves us so much time!',
            },
            {
              name: 'Mr. Patel, Teacher',
              quote: 'Tracking student progress and communicating with parents has never been easier. Highly recommend!',
            },
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <p className="text-[#4A90E2] font-semibold">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A90E2] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold">Corebridge</h3>
            <p className="text-sm mt-2">Empowering schools with smarter management solutions.</p>
          </div>
          <div className="flex space-x-6">
            <motion.a
              href="#"
              className="hover:text-[#FFD700] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-[#FFD700] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-[#d6c5f7] transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              Contact Us
            </motion.a>
          </div>
        </div>
        <div className="text-center mt-8">
          <motion.button
            className="bg-[#FFD700] text-[#333333] px-8 py-3 rounded-full text-lg hover:bg-[#ba9df1] hover:text-white transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </div>
      </footer>
    </div>
  );
}