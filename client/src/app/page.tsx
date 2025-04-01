"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import SignInDialog from "./components/SignInDialog"
import { SignInCredentials } from "./types/auth"

// Animation variants for different elements
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const floatVariants = {
  float: {
    y: [0, -15, 0],
    transition: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
  },
}

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function Page() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)

  // Parallax effect for hero section
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -150])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // Features data with more detailed information
  const features = [
    {
      title: "Intelligent Class Management",
      description:
        "Organize schedules, assign teachers, and manage classrooms with AI-powered optimization that ensures the best use of resources.",
      icon: "📅",
      color: "from-purple-400/20 to-purple-600/20",
      iconBg: "bg-purple-100",
    },
    {
      title: "Comprehensive Student Progress",
      description:
        "Track grades, attendance, and performance with detailed reports and predictive analytics to identify areas for improvement.",
      icon: "📊",
      color: "from-purple-300/20 to-purple-500/20",
      iconBg: "bg-purple-100",
    },
    {
      title: "Seamless Parent Communication",
      description:
        "Keep parents informed with real-time updates, automated messages, and easy scheduling for parent-teacher conferences.",
      icon: "📩",
      color: "from-purple-500/20 to-purple-700/20",
      iconBg: "bg-purple-100",
    },
    {
      title: "Resource Management",
      description:
        "Efficiently allocate and track school resources, from textbooks to technology, ensuring every student has what they need to succeed.",
      icon: "📚",
      color: "from-purple-200/20 to-purple-400/20",
      iconBg: "bg-purple-100",
    },
  ]

  // Testimonials with more detailed information
  const testimonials = [
    {
      name: "Mrs. Johnson",
      role: "Principal, Lincoln High School",
      quote:
        "Corebridge has transformed how we manage our school. The intuitive interface and powerful analytics have saved us countless hours and improved our decision-making process.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Mr. Patel",
      role: "Science Teacher, Westview Academy",
      quote:
        "Tracking student progress and communicating with parents has never been easier. The automated reports and communication tools have revolutionized how I manage my classroom.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Ms. Rodriguez",
      role: "IT Administrator, Springfield Elementary",
      quote:
        "The technical implementation was seamless, and the support team has been exceptional. Corebridge integrates perfectly with our existing systems while adding powerful new capabilities.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  // Stats with animations
  const stats = [
    { value: "98%", label: "User Satisfaction", delay: 0 },
    { value: "500+", label: "Schools Using Corebridge", delay: 0.2 },
    { value: "35%", label: "Time Saved on Administration", delay: 0.4 },
    { value: "24/7", label: "Customer Support", delay: 0.6 },
  ]

  // Handle scroll events for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Feature rotation
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(interval)
    }
  }, [features.length])

  const handleSignIn = async (credentials: SignInCredentials) => {
    // Here you would typically make an API call to authenticate the user
    console.log('Signing in with:', credentials);
    
    // Mock different redirects based on role
    switch (credentials.role) {
      case 'student':
        window.location.href = '/dashboard/student';
        break;
      case 'teacher':
        window.location.href = '/dashboard/teacher';
        break;
      case 'admin':
        window.location.href = '/dashboard/admin';
        break;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#F5F7FA] to-[#f8f5ff] flex flex-col min-h-screen">
      {/* Add SignInDialog */}
      <SignInDialog
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSignIn={handleSignIn}
      />

      {/* Navbar with glass effect when scrolled */}
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-6"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center px-6">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-3xl font-bold text-[#ba9df1]">
              Core<span className="text-white">bridge</span>
            </div>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#ba9df1] focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {["Features", "Testimonials", "Pricing", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[#ba9df1] hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
            <motion.a
              onClick={() => setIsSignInOpen(true)}
              className="text-[#ba9df1] border border-[#ba9df1] px-4 py-2 rounded-full hover:bg-[#ba9df1] hover:text-white transition-all cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(186, 157, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in
            </motion.a>
            <motion.a
              href="#"
              className="bg-[#ba9df1] text-white px-4 py-2 rounded-full hover:bg-[#a78be0] transition-all"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(186, 157, 241, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col p-4 space-y-3">
                {["Features", "Testimonials", "Pricing", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-[#ba9df1] hover:text-white py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <a
                  onClick={() => setIsSignInOpen(true)}
                  className="text-[#ba9df1] border border-[#ba9df1] px-4 py-2 rounded-full text-center hover:bg-[#ba9df1] hover:text-white transition-all cursor-pointer"
                >
                  Sign in
                </a>
                <a
                  href="#"
                  className="bg-[#ba9df1] text-white px-4 py-2 rounded-full text-center hover:bg-[#a78be0] transition-all"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section with parallax effect */}
      <motion.section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden bg-gradient-to-br from-[#F5F7FA] to-[#E6F0FA] pt-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        id="hero"
      >
        {/* Animated background elements */}
        <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
          <motion.div
            className="absolute top-10 left-10 bg-[#FFD700] opacity-20 w-72 h-72 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-10 right-10 bg-white opacity-20 w-72 h-72 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 bg-[#ba9df1] opacity-20 w-64 h-64 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
          />
        </motion.div>

        {/* Floating UI Elements with glass morphism */}
        <motion.div
          className="absolute top-20 left-10 bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20"
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
          className="absolute top-40 right-20 bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20"
          variants={floatVariants}
          animate="float"
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-[#333333]">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 rounded-full bg-[#ba9df1] mr-2"></div>
              <p className="font-semibold">Parent-Teacher Meeting</p>
            </div>
            <p>Discuss student progress</p>
            <p className="text-xs text-gray-500">3:00 PM - 4:00 PM</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-20 bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20"
          variants={floatVariants}
          animate="float"
          transition={{ delay: 1 }}
        >
          <div className="text-sm text-[#333333]">
            <p className="font-semibold">Assignments Due</p>
            <div className="mt-1">
              <div className="flex items-center justify-between">
                <span>Science Project</span>
                <span className="text-[#ba9df1]">80%</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                <div className="bg-[#ba9df1] h-1.5 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span>History Essay</span>
                <span className="text-yellow-500">20%</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            className="inline-block px-4 py-1 rounded-full bg-[#ba9df1]/10 text-[#ba9df1] font-medium text-sm mb-6"
            variants={itemVariants}
          >
            Next-Generation School Management
          </motion.div>
          <motion.h1 className="text-5xl md:text-7xl font-bold text-[#ba9df1] mb-4" variants={itemVariants}>
            Manage Your School
          </motion.h1>
          <motion.h2 className="text-3xl md:text-5xl text-[#333333] mb-6" variants={itemVariants}>
            Seamlessly, All in One Place
          </motion.h2>
          <motion.p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" variants={itemVariants}>
            Streamline class schedules, track student progress, communicate with parents, and manage school operations
            with Corebridge's intelligent platform.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <motion.button
              className="bg-[#ba9df1] text-white px-8 py-3 rounded-full text-lg hover:bg-[#a78be0] transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, boxShadow: "0px 8px 25px rgba(186, 157, 241, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
            <motion.button
              className="bg-white text-[#ba9df1] border border-[#ba9df1] px-8 py-3 rounded-full text-lg hover:bg-[#ba9df1] hover:text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1, duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5V19M12 19L5 12M12 19L19 12"
                stroke="#ba9df1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: stat.delay }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="text-4xl md:text-5xl font-bold text-[#ba9df1]"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: stat.delay }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with interactive cards */}
      <section className="py-16 px-6" id="features">
        <motion.h2
          className="text-4xl font-bold text-center text-[#ba9df1] mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Why Choose Corebridge?
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Our comprehensive platform provides everything you need to run your educational institution efficiently
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${feature.color} p-1 rounded-xl shadow-lg`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-6 rounded-lg h-full flex flex-col">
                <div
                  className={`text-4xl mb-4 ${feature.iconBg} w-16 h-16 rounded-full flex items-center justify-center`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#333333] mb-2">{feature.title}</h3>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
                <motion.button className="mt-4 text-[#ba9df1] font-medium flex items-center" whileHover={{ x: 5 }}>
                  Learn more
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#E6F0FA] to-[#F5F7FA]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-[#ba9df1] mb-6"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                Powerful Features That Make a Difference
              </motion.h2>

              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      activeFeature === idx ? "bg-white shadow-md border-l-4 border-[#ba9df1]" : "hover:bg-white/50"
                    }`}
                    onClick={() => setActiveFeature(idx)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start">
                      <div
                        className={`${feature.iconBg} w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0`}
                      >
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#333333]">{feature.title}</h3>
                        {activeFeature === idx && (
                          <motion.p
                            className="text-gray-600 mt-2 text-sm"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {feature.description}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#ba9df1]/10 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-tr-full"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <div
                    className={`${features[activeFeature].iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto`}
                  >
                    <span className="text-4xl">{features[activeFeature].icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4">{features[activeFeature].title}</h3>

                  {/* Feature preview UI - changes based on selected feature */}
                  {activeFeature === 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium">Class Schedule</div>
                        <div className="text-xs bg-[#ba9df1]/20 text-[#ba9df1] px-2 py-1 rounded">Monday</div>
                      </div>
                      {[
                        { time: "9:00 - 10:30", subject: "Mathematics", teacher: "Mr. Johnson", room: "A101" },
                        { time: "10:45 - 12:15", subject: "Science", teacher: "Ms. Garcia", room: "B202" },
                        { time: "13:00 - 14:30", subject: "History", teacher: "Dr. Smith", room: "C303" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center py-2 border-b border-gray-200 last:border-0">
                          <div className="w-24 text-sm text-gray-500">{item.time}</div>
                          <div className="flex-1">
                            <div className="font-medium">{item.subject}</div>
                            <div className="text-xs text-gray-500">
                              {item.teacher} • Room {item.room}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeFeature === 1 && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium">Student Progress</div>
                        <div className="text-xs bg-[#ba9df1]/20 text-[#ba9df1] px-2 py-1 rounded">Term 1</div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { subject: "Mathematics", score: 85, color: "bg-blue-500" },
                          { subject: "Science", score: 92, color: "bg-green-500" },
                          { subject: "English", score: 78, color: "bg-yellow-500" },
                          { subject: "History", score: 88, color: "bg-purple-500" },
                        ].map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.subject}</span>
                              <span className="font-medium">{item.score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full">
                              <div
                                className={`${item.color} h-2 rounded-full`}
                                style={{ width: `${item.score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFeature === 2 && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium">Parent Communication</div>
                        <div className="text-xs bg-[#ba9df1]/20 text-[#ba9df1] px-2 py-1 rounded">New Messages</div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { parent: "Mrs. Wilson", subject: "Absence Note", time: "10:30 AM", unread: true },
                          { parent: "Mr. Thompson", subject: "Field Trip Permission", time: "2:15 PM", unread: false },
                          {
                            parent: "Dr. Patel",
                            subject: "Parent-Teacher Conference",
                            time: "Yesterday",
                            unread: false,
                          },
                          {
                            parent: "Dr. Patel",
                            subject: "Parent-Teacher Conference",
                            time: "Yesterday",
                            unread: false,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className={`flex items-center p-2 rounded-lg ${item.unread ? "bg-blue-50" : ""}`}
                          >
                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium">{item.parent}</span>
                                {item.unread && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>}
                              </div>
                              <div className="text-sm text-gray-600">{item.subject}</div>
                            </div>
                            <div className="text-xs text-gray-500">{item.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFeature === 3 && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-medium">Resource Management</div>
                        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Inventory</div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { item: "Textbooks", total: 500, available: 432, status: "Good" },
                          { item: "Tablets", total: 120, available: 98, status: "Low" },
                          { item: "Lab Equipment", total: 50, available: 45, status: "Good" },
                          { item: "Sports Equipment", total: 200, available: 156, status: "Medium" },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                          >
                            <div>
                              <div className="font-medium">{item.item}</div>
                              <div className="text-xs text-gray-500">
                                {item.available} of {item.total} available
                              </div>
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded ${
                                item.status === "Good"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with cards */}
      <section className="py-16 px-6" id="testimonials">
        <motion.h2
          className="text-4xl font-bold text-center text-[#ba9df1] mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          What Our Users Say
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join hundreds of schools already transforming their administration with Corebridge
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-5 left-6 text-5xl text-[#ba9df1] opacity-20">"</div>
              <div className="relative z-10">
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="text-[#ba9df1] font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#F5F7FA] to-[#E6F0FA]" id="pricing">
        <motion.h2
          className="text-4xl font-bold text-center text-[#ba9df1] mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Choose the plan that works best for your school's needs
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Starter",
              price: "$99",
              period: "per month",
              description: "Perfect for small schools just getting started",
              features: ["Up to 200 students", "Basic scheduling", "Grade tracking", "Email support", "1 admin user"],
              cta: "Get Started",
              popular: false,
              color: "border-gray-200 hover:border-[#ba9df1]",
            },
            {
              name: "Professional",
              price: "$249",
              period: "per month",
              description: "Ideal for growing schools with more needs",
              features: [
                "Up to 1,000 students",
                "Advanced scheduling",
                "Comprehensive reporting",
                "Parent portal access",
                "Priority support",
                "5 admin users",
              ],
              cta: "Get Started",
              popular: true,
              color: "border-[#ba9df1] bg-white",
            },
            {
              name: "Enterprise",
              price: "Custom",
              period: "pricing",
              description: "For large institutions with complex requirements",
              features: [
                "Unlimited students",
                "Custom integrations",
                "Advanced analytics",
                "Dedicated account manager",
                "SLA guarantees",
                "Unlimited admin users",
              ],
              cta: "Contact Sales",
              popular: false,
              color: "border-gray-200 hover:border-[#ba9df1]",
            },
          ].map((plan, idx) => (
            <motion.div
              key={idx}
              className={`rounded-xl p-6 border-2 ${plan.color} relative ${plan.popular ? "shadow-xl" : "shadow-lg"}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#ba9df1] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#333333] mb-2">{plan.name}</h3>
                <div className="flex items-end justify-center">
                  <span className="text-4xl font-bold text-[#ba9df1]">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                className={`w-full py-2 rounded-lg font-medium ${
                  plan.popular
                    ? "bg-[#ba9df1] text-white hover:bg-[#a78be0]"
                    : "bg-white text-[#ba9df1] border border-[#ba9df1] hover:bg-[#ba9df1] hover:text-white"
                } transition-colors`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-[#ba9df1] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your School Management?
          </motion.h2>
          <motion.p
            className="text-lg mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join hundreds of schools already using Corebridge to streamline their operations and improve educational
            outcomes.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="bg-white text-[#ba9df1] px-8 py-3 rounded-full text-lg font-medium hover:bg-[#F5F7FA] transition-colors"
              whileHover={{ scale: 1.05, boxShadow: "0px 8px 25px rgba(255, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
            <motion.button
              className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-full text-lg font-medium hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6" id="contact">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-[#ba9df1] mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Have questions or need more information? Our team is here to help.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-[#333333] mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#ba9df1]/10 p-3 rounded-full mr-4">
                    <svg className="w-5 h-5 text-[#ba9df1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#333333]">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#ba9df1]/10 p-3 rounded-full mr-4">
                    <svg className="w-5 h-5 text-[#ba9df1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#333333]">Email</h4>
                    <p className="text-gray-600">info@corebridge.edu</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#ba9df1]/10 p-3 rounded-full mr-4">
                    <svg className="w-5 h-5 text-[#ba9df1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#333333]">Address</h4>
                    <p className="text-gray-600">
                      123 Education Lane, Suite 400
                      <br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#333333] mt-8 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="bg-[#ba9df1]/10 p-3 rounded-full text-[#ba9df1] hover:bg-[#ba9df1] hover:text-white transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-[#333333] mb-4">Send us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9df1] focus:border-transparent outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9df1] focus:border-transparent outline-none transition-all"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9df1] focus:border-transparent outline-none transition-all"
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba9df1] focus:border-transparent outline-none transition-all"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-[#ba9df1] text-white py-2 rounded-lg font-medium hover:bg-[#a78be0] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#ba9df1] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Corebridge</h3>
              <p className="text-white/80 mb-4 max-w-md">
                Empowering schools with smarter management solutions. Our platform helps educational institutions
                streamline operations and focus on what matters most: education.
              </p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Features", "Pricing", "Testimonials", "Contact"].map((link) => (
                  <li key={link}>
                    <motion.a
                      href={`#${link.toLowerCase()}`}
                      className="text-white/80 hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Blog", "Help Center", "Documentation", "API", "Privacy Policy", "Terms of Service"].map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">© {new Date().getFullYear()} Corebridge. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <motion.button
                className="bg-white text-[#ba9df1] px-6 py-2 rounded-full text-sm font-medium hover:bg-[#f5f5f5] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

