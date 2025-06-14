// Ensure this file has: export default Page;
// This is your main landing page component.
import Link from "next/link"
import { Button } from "@/components/ui/button" // Assuming you have this shadcn component

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-6">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">RMCOHST Application Portal</h1>
        <p className="text-xl text-slate-300">
          Welcome to the Rivers State College of Health Science and Management Technology Online Application.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold mb-6 text-teal-400">For Applicants</h2>
          <p className="mb-6 text-slate-300">
            Start your journey with us. Register or log in to complete your application, upload documents, and track
            your admission status.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold flex-1">
              <Link href="/applicant/register">Register Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-slate-900 font-semibold flex-1"
            >
              <Link href="/applicant/login">Applicant Login</Link>
            </Button>
          </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl font-semibold mb-6 text-sky-400">For Administration</h2>
          <p className="mb-6 text-slate-300">
            Access the admin dashboard to manage applications, review submissions, and oversee the admission process.
          </p>
          <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600 text-slate-900 font-semibold w-full">
            <Link href="/admin/login">Admin Login</Link>
          </Button>
        </div>
      </main>

      <footer className="mt-16 text-center text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} Rivers State College of Health Science and Management Technology. All rights
          reserved.
        </p>
        <p className="text-sm mt-1">Empowering future healthcare professionals.</p>
      </footer>
    </div>
  )
}
export default Page
