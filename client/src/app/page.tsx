import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, FileText, GraduationCap } from 'lucide-react'

import { MapPin, Users, BookOpen, Beaker, Dumbbell, Coffee } from 'lucide-react'
const sections = [
  {
    title: 'Undergraduate',
    bg: 'bg-gray-100',
    links: ['Undergraduate Admission', 'Faculties & Departments', 'Other Information']
  },
  {
    title: 'Postgraduate',
    bg: 'bg-blue-900 text-white',
    links: ['Postgraduate Admission', 'Programmes Offered', 'Postgraduate Portal']
  },
  {
    title: 'Pre-Degree',
    bgImage: '/images/predegree.jpg', // Add this image to `public/images/`
    links: ['Basic Studies', 'Pre-degree Certificate', 'Other Relevant Links']
  }
]
const steps = [
  {
    id: '01',
    title: 'Visit the Portal',
    description:
      'Take the time to explore the diverse range of undergraduate and graduate programs offered at University of Port Harcourt',
    icon: GraduationCap
  },
  {
    id: '02',
    title: 'Online Application',
    description:
      'Take the time to explore the diverse range of undergraduate and graduate programs offered at University of Port Harcourt',
    icon: FileText
  },
  {
    id: '03',
    title: 'Programs & Requirements',
    description:
      'Take the time to explore the diverse range of undergraduate and graduate programs offered at University of Port Harcourt',
    icon: BookOpen
  }
]
const facilities = [
  {
    id: 1,
    title: 'Main Library',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
    icon: BookOpen,
    description: 'State-of-the-art research facility'
  },
  {
    id: 2,
    title: 'Science Laboratory',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop',
    icon: Beaker,
    description: 'Advanced scientific equipment'
  },
  {
    id: 3,
    title: 'Student Center',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=500&h=300&fit=crop',
    icon: Users,
    description: 'Hub for student activities'
  },
  {
    id: 4,
    title: 'Sports Complex',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
    icon: Dumbbell,
    description: 'Modern fitness and sports facilities'
  },
  {
    id: 5,
    title: 'Lecture Halls',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&h=300&fit=crop',
    icon: MapPin,
    description: 'Modern learning environments'
  },
  {
    id: 6,
    title: 'Cafeteria',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop',
    icon: Coffee,
    description: 'Dining and social space'
  }
]

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">RMCOHST Application Portal</h1>
        <p className="text-xl text-slate-300">
          Welcome to the Rivers State College of Health Science and Management Technology Online
          Application.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold mb-6 text-teal-400">For Applicants</h2>
          <p className="mb-6 text-slate-300">
            Start your journey with us. Register or log in to complete your application, upload
            documents, and track your admission status.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold flex-1">
              <Link href="/applicant/register">Register Now</Link>
            </button>
            <button className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-slate-900 font-semibold flex-1">
              <Link href="/applicant/login">Applicant Login</Link>
            </button>
          </div>
        </div>
      </main>
      <section className="flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-10 gap-10">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 relative">
          <Image
            src="/images/uniport.jpg" // Make sure the image is in the public/images folder
            alt="University of Port Harcourt"
            width={600}
            height={400}
            className="rounded-md shadow-lg w-full h-auto object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-1 rounded-md text-xl font-semibold">
            Gist
          </div>
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
            UNIVERSITY OF <br /> PORT HARCOURT
          </h2>
          <p className="mt-6 text-gray-700 text-base md:text-lg leading-relaxed">
            At University of Port Harcourt, we believe in the transformative power of education and
            the boundless potential within every individual. Established in 1975, we have been
            dedicated to fostering intellectual curiosity, academic excellence, and a vibrant campus
            community.
          </p>
          <h3 className="mt-10 text-4xl md:text-6xl font-bold text-gray-300 tracking-wide">
            EST. 1975
          </h3>
        </div>
      </section>
      <section className="py-16 px-6 md:px-10 bg-white">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-12">
          Academics & Programmes
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const isEven = index % 2 === 0

            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden mb-6
              ${
                isEven
                  ? 'bg-gradient-to-br from-white to-gray-50 text-black border border-gray-200 hover:shadow-blue-500/25'
                  : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:shadow-purple-500/25'
              }`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>

                {/* Hover Gradient Overlay */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              ${
                isEven
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700'
                  : 'bg-gradient-to-br from-purple-600 to-indigo-700'
              }`}
                ></div>

                <div className="relative z-10">
                  <h3
                    className={`text-2xl font-bold mb-6 transition-colors duration-300
                ${isEven ? 'group-hover:text-white' : 'group-hover:text-blue-100'}`}
                  >
                    {section.title}
                  </h3>

                  <div className="space-y-4">
                    {section.links.map((link, i) => (
                      <button
                        key={i}
                        className={`group/link w-full text-left border px-4 py-3 rounded-lg transition-all duration-300 flex justify-between items-center relative overflow-hidden
                      ${
                        isEven
                          ? 'border-gray-300 hover:border-blue-400 group-hover:border-white/30 group-hover:text-white'
                          : 'border-gray-600 hover:border-purple-400 group-hover:border-white/30 group-hover:text-white'
                      }`}
                      >
                        {/* Link Background Hover */}
                        <div
                          className={`absolute inset-0 opacity-0 group-hover/link:opacity-20 transition-opacity duration-300
                      ${
                        isEven
                          ? 'bg-blue-600 group-hover:bg-white/10'
                          : 'bg-purple-600 group-hover:bg-white/10'
                      }`}
                        ></div>

                        <span className="relative z-10 font-medium">{link}</span>

                        <ArrowRight className="w-4 h-4 transition-all duration-300 group-hover/link:translate-x-1 relative z-10" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Accent */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left
              ${
                isEven
                  ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                  : 'bg-gradient-to-r from-purple-400 to-indigo-500'
              }`}
                ></div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="bg-white min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">How to Apply</h1>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon

              return (
                <div
                  key={step.id}
                  className="group relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 cursor-pointer overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>

                  {/* Step Number */}
                  <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-white/20 group-hover:text-white/30 transition-colors duration-300">
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-blue-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-300/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Bottom Border Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              )
            })}
          </div>

          <div className="bg-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Campus Facilities</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Explore our world-class facilities designed to enhance your academic experience
                </p>
              </div>

              {/* Facilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {facilities.map((facility, index) => {
                  const Icon = facility.icon
                  const isEven = index % 2 === 0

                  return (
                    <div
                      key={facility.id}
                      className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
                    >
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={facility.image}
                          alt={facility.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Gradient Overlay */}
                        <div
                          className={`absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500
                    ${
                      isEven
                        ? 'bg-gradient-to-t from-blue-900/90 via-blue-600/50 to-transparent'
                        : 'bg-gradient-to-t from-purple-900/90 via-purple-600/50 to-transparent'
                    }`}
                        ></div>

                        {/* Icon */}
                        <div
                          className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300
                    ${
                      isEven
                        ? 'bg-blue-500/20 text-white group-hover:bg-blue-400/30'
                        : 'bg-purple-500/20 text-white group-hover:bg-purple-400/30'
                    }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500
                  ${
                    isEven
                      ? 'bg-gradient-to-t from-blue-900/95 to-transparent'
                      : 'bg-gradient-to-t from-purple-900/95 to-transparent'
                  }`}
                      >
                        <h3 className="text-2xl font-bold mb-2 transition-transform duration-300 group-hover:translate-y-[-2px]">
                          {facility.title}
                        </h3>
                        <p className="text-blue-100 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                          {facility.description}
                        </p>

                        {/* Bottom Accent */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left
                    ${
                      isEven
                        ? 'bg-gradient-to-r from-blue-400 to-blue-200'
                        : 'bg-gradient-to-r from-purple-400 to-purple-200'
                    }`}
                        ></div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div
                        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none
                  ${isEven ? 'bg-blue-400' : 'bg-purple-400'}`}
                      ></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1">
              <span className="relative z-10">Start Your Application</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} Rivers State College of Health Science and Management
          Technology. All rights reserved.
        </p>
        <p className="text-sm mt-1">Empowering future healthcare professionals.</p>
      </footer>
    </div>
  )
}
export default Page
