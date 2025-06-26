'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, FileText, GraduationCap, SyringeIcon } from 'lucide-react'
import headerBackgroundImage from '../images/headerBackgroundImage.jpeg'
import classRoomImage from '../images/classroom.jpeg'
import laboratoryImage from '../images/laboratory.jpeg'
import sickBayImage from '../images/sickbay.jpeg'
import hallImage from '../images/hall.jpeg'
import hostelImage from '../images/hostel.jpeg'

import { MapPin, Users, BookOpen, Beaker, Dumbbell, Coffee } from 'lucide-react'
const sections = [
  {
    title: 'Undergraduate',
    bg: 'bg-gray-100',
    links: ['Undergraduate Admission', 'Faculties & Departments', 'Other Information']
  },
  {
    title: 'Postgraduate',
    bg: 'bg-slate-900 text-white',
    links: ['Postgraduate Admission', 'Programmes Offered', 'Postgraduate Portal']
  },
  {
    title: 'Certificate Studies',
    bgImage: '', // Add this image to `public/images/`
    links: ['Certificate Studies Admission', 'Programmes Offered', 'Certificate Studies Portal']
  }
]
const steps = [
  {
    id: '01',
    title: 'Visit the Portal',
    description:
      'Take the time to explore the diverse range of undergraduate and graduate programs offered at Remington College Of Health Science And Technology Port Harcourt',
    icon: GraduationCap
  },
  {
    id: '02',
    title: 'Online Application',
    description:
      'Take the time to explore the diverse range of undergraduate and graduate programs offered at Remington College Of Health Science And Technology Port Harcourt',
    icon: FileText
  },
  {
    id: '03',
    title: 'Programs & Requirements',
    description:
      'Take the time to explore the diverse range of undergraduate and graduate programs offered at Remington College Of Health Science And Technology Port Harcourt',
    icon: BookOpen
  }
]
const facilities = [
  {
    id: 1,
    title: 'Classrooms',
    image: classRoomImage,
    icon: BookOpen,
    description: 'Conducive learning environment'
  },
  {
    id: 2,
    title: 'Science Laboratory',
    image: laboratoryImage,
    icon: Beaker,
    description: 'Advanced scientific equipment'
  },
  {
    id: 3,
    title: 'Student Hostels',
    image: hostelImage,
    icon: Users,
    description: 'Comfortable Accomodation'
  },
  {
    id: 4,
    title: 'Sick Bay',
    image: sickBayImage,
    icon: SyringeIcon,
    description: 'Modern and equiped sick bay'
  },
  {
    id: 5,
    title: ' Halls',
    image: hallImage,
    icon: MapPin,
    description: 'Modern event and lecture halls'
  },
  {
    id: 6,
    title: 'Admin Block',
    image: '',
    icon: Coffee,
    description: 'Comfortable Admin Block to ensure quality education delivery'
  }
]

const Page = () => {
  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
<header
  className="relative w-full h-auto min-h-[30rem] bg-cover bg-center text-white mb-3"
  style={{
    backgroundImage: `url(${headerBackgroundImage.src})`,
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Content */}
  <div className="relative z-10 flex flex-col justify-center items-center px-4 py-10 text-center h-full">
    <h1 className="text-3xl md:text-5xl font-bold mb-4">RMCOHST Application Portal</h1>
    <p className="text-base md:text-xl text-slate-300 mb-6 max-w-3xl">
      Welcome to the Remington College of Health Science and Technology Online Application Portal.
    </p>

    {/* Action Box */}
    <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md sm:max-w-xl mx-auto transition-all duration-300">
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">For Applicants</h2>
      <p className="mb-6 text-slate-300 text-sm md:text-base">
        Start your journey with us. Register or log in to complete your application, upload
        documents, and track your admission status.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/auth/applicant-signup"
          className="bg-white hover:bg-teal-300 text-slate-800 font-semibold flex-1 text-center py-2 rounded"
        >
          Register Now
        </Link>
        <Link
          href="/auth/login"
          className="border border-white text-white hover:bg-teal-300 hover:text-slate-900 font-semibold flex-1 text-center py-2 rounded"
        >
          Applicant Login
        </Link>
      </div>
    </div>
  </div>
</header>

      <section className="flex flex-col md:flex-row items-center justify-center px-6 md:px-16 gap-10">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 relative">
          {/* <Image
            src="/images/uniport.jpg" // Make sure the image is in the public/images folder
            alt="Remington College Of Health Science And Technology Port Harcourt"
            width={600}
            height={400}
            className="rounded-md shadow-lg w-full h-auto object-cover"
          /> */}
       
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
            REMINGTON COLLEGE OF HEALTH SCIENCE AND TECHNOLOGY
          </h2>
          <p className="mt-6 text-gray-700 text-base md:text-lg leading-relaxed">
            At Remington College Of Health Science And Technology Port Harcourt, we believe in the transformative power of education and
            the boundless potential within every individual.We are
            dedicated to fostering intellectual curiosity, academic excellence, and a vibrant campus
            community.
          </p>
        </div>
      </section>
      <section className="py-6 px-6 md:px-10 bg-white">
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
                  ? 'bg-gradient-to-br from-white to-gray-50 text-black border border-gray-200 hover:shadow-slate-500/25'
                  : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:shadow-slate-200/25'
              }`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>

                {/* Hover Gradient Overlay */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              ${
                isEven
                  ? 'bg-gradient-to-br from-slate-500 to-slate-700'
                  : 'bg-gradient-to-br from-slate-600 to-indigo-700'
              }`}
                ></div>

                <div className="relative z-10">
                  <h3
                    className={`text-2xl font-bold mb-6 transition-colors duration-300
                ${isEven ? 'group-hover:text-white' : 'group-hover:text-slate-100'}`}
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
                          ? 'border-gray-300 hover:border-slate-400 group-hover:border-white/30 group-hover:text-white'
                          : 'border-gray-600 hover:border--400 group-hover:border-white/30 group-hover:text-white'
                      }`}
                      >
                        {/* Link Background Hover */}
                        <div
                          className={`absolute inset-0 opacity-0 group-hover/link:opacity-20 transition-opacity duration-300
                      ${
                        isEven
                          ? 'bg-slate-600 group-hover:bg-white/10'
                          : 'bg-slate-600 group-hover:bg-white/10'
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
                  ? 'bg-gradient-to-r from-slate-400 to-slate-600'
                  : 'bg-gradient-to-r from-slate-400 to-indigo-500'
              }`}
                ></div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="bg-white min-h-screen px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">How to Apply</h1>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon

              return (
                <div
                  key={step.id}
                  className="group relative bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-slate-500/25 cursor-pointer overflow-hidden"
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
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-slate-100 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-slate-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-400/0 via-slate-300/10 to-slate-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Bottom Border Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-300 to-slate-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
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
                        <Image
                          src={facility.image}
                          alt={facility.title}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        /> 

                        Gradient Overlay
                        <div
                          className={`absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500
                    ${
                      isEven
                        ? 'bg-gradient-to-t from-slate-900/90 via-slate-600/50 to-transparent'
                        : 'bg-gradient-to-t from-slate-900/90 via-slate-600/50 to-transparent'
                    }`}
                        ></div>

                        <div
                          className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300
                    ${
                      isEven
                        ? 'bg-slate-500/20 text-white group-hover:bg-slate-400/30'
                        : 'bg-slate-500/20 text-white group-hover:bg-slate-400/30'
                    }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      Content 
                      <div
                        className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500
                  ${
                    isEven
                      ? 'bg-gradient-to-t from-slate-900/95 to-transparent'
                      : 'bg-gradient-to-t from-slate-900/95 to-transparent'
                  }`}
                      >
                        <h3 className="text-2xl font-bold mb-2 transition-transform duration-300 group-hover:translate-y-[-2px]">
                          {facility.title}
                        </h3>
                        <p className="text-slate-100 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                          {facility.description}
                        </p>

                        {/* Bottom Accent */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left
                    ${
                      isEven
                        ? 'bg-gradient-to-r from-slate-400 to-slate-200'
                        : 'bg-gradient-to-r from-slate-400 to-slate-200'
                    }`}
                        ></div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div
                        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none
                  ${isEven ? 'bg-slate-400' : 'bg-slate-400'}`}
                      ></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6 text-center">
            <Link
            href='/auth/applicant-signup'
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-700 rounded-full transition-all duration-300 hover:from-slate-700 hover:to-slate-800 hover:shadow-lg hover:shadow-slate-500/25 transform hover:-translate-y-1">
              <span className="relative z-10">Start Your Application</span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-900 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-6 text-center text-white bg-slate-900 w-full h-[10rem] flex flex-col justify-center items-center">
        <p>
          &copy; {new Date().getFullYear()} Remington College of Health Science and Management
          Technology. All rights reserved.
        </p>
        <p className="text-sm mt-1">Empowering future healthcare professionals.</p>
      </footer>
    </div>
  )
}
export default Page
