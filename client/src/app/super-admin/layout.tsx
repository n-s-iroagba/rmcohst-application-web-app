'use client'

import type React from 'react'
import {
  X as XMarkIcon,
  Menu as Bars3Icon,
  UserCircle,
  UserMinus,
  GraduationCapIcon,
  CalendarCheck,
  File,
  BookIcon,
  Book,
  CheckCircle
} from 'lucide-react'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useResizeWindow } from '@/hooks/useResizeWindow'
import { AuthProvider } from '@/contexts/AuthContext'

interface SuperAdminOffCanvas {
  children: React.ReactNode
}

function SuperAdminOffCanvas({ children }: SuperAdminOffCanvas) {
  const { isDesktop, isOpen, handleNavClick } = useResizeWindow()
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <button
        onClick={() => handleNavClick()}
        className="lg:hidden fixed top-2 left-2 z-50 p-2 rounded-lg bg-slate-100 border border-slate-900 text-slate-900 shadow-lg hover:bg-slate-200 transition-all"
        aria-label="Toggle navigation"
      >
        {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
      </button>

      <aside
        className={`fixed lg:relative top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 w-64 sm:w-72 lg:w-64 bg-slate-900 border-r border-slate-700 shadow-xl lg:shadow-none`}
      >
        <nav className="h-full overflow-y-auto p-3 lg:p-4 flex flex-col">
          <div className="mb-4 p-3 lg:p-4 border-b border-slate-700">
            <UserCircle className="h-8 w-8 lg:h-10 lg:w-10 text-slate-100 mx-auto" />
            <h2 className="mt-2 text-center text-base lg:text-lg font-semibold text-slate-100">
              Admin Dashboard
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            {[
              { href: '/super-admin/undone-tasks', text: 'Pending Tasks', icon: File },
              {
                href: '/super-admin/academic-session',
                text: 'Academic Sessions',
                icon: CalendarCheck
              },
              { href: '/super-admin/faculties', text: 'Faculties', icon: BookIcon },
              {
                href: '/super-admin/departments',
                text: 'Departments',
                icon: Book
              },
                { href: '/super-admin/accepted-subjects-and-grades', text: "Accepted Subjects And Grades", icon: CheckCircle },
                { href: '/super-admin/ssc-requirements', text: "O'Level Requirement", icon: BookIcon },
              {
                href: '/super-admin/program-specific-requirements',
                text: 'Other Program Requirements',
                icon: Book
              },
                { href: '/super-admin/programs', text: "Programs Offered", icon: GraduationCapIcon },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 text-slate-900 p-3 rounded-lg
                         bg-slate-100/10 hover:bg-slate-100/20 active:bg-slate-100/30 transition-all
                         border border-transparent hover:border-slate-100/30 touch-manipulation"
                onClick={handleNavClick}
              >
                <item.icon className="h-4 w-4 lg:h-5 lg:w-5 text-slate-100 flex-shrink-0" />
                <span className="text-slate-100 font-medium text-sm lg:text-base truncate">
                  {item.text}
                </span>
              </Link>
            ))}
            <Link
              href={''}
              className="flex items-center gap-3 text-slate-900 p-3 rounded-lg
                         bg-slate-100/10 hover:bg-slate-100/20 active:bg-slate-100/30 transition-all
                         border border-transparent hover:border-slate-100/30 touch-manipulation"
              onClick={() => logout()}
            >
              <UserMinus className="h-4 w-4 lg:h-5 lg:w-5 text-slate-100 flex-shrink-0" />
              <span className="text-slate-100 font-medium text-sm lg:text-base truncate">
                Log out
              </span>
            </Link>
          </div>
        </nav>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${isOpen && !isDesktop ? 'overflow-hidden' : ''}`}
      >
        <div className="p-3 sm:p-4 lg:p-6 min-h-screen">
          <div className="pt-12 lg:pt-0">
            <div className="max-w-6xl mx-auto bg-white rounded-lg lg:rounded-xl shadow-sm border border-slate-100 p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SuperAdminOffCanvas>{children}</SuperAdminOffCanvas>
    </AuthProvider>
  )
}
