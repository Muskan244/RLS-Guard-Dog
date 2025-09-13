'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { supabase } from '../../../lib/supabaseClient'

export default function Navbar() {
  const { user, loading } = useUser()
  const role = user?.user_metadata?.role as 'teacher' | 'student' | undefined
  const pathname = usePathname()

  return (
    <nav className="bg-blue-600/95 text-white px-4 py-2 shadow-sm sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-blue-600/80">
      <div className="mx-auto max-w-6xl w-full flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight">RLS Guard Dog</Link>
        {!loading && (
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link className={`text-white/90 hover:text-white transition-colors ${pathname === '/login' ? 'text-white font-semibold' : ''}`} href="/login">Login</Link>
                <Link className={`text-white/90 hover:text-white transition-colors ${pathname === '/signup' ? 'text-white font-semibold' : ''}`} href="/signup">Sign Up</Link>
              </>
            ) : (
              <>
                <Link className={`text-white/90 hover:text-white transition-colors ${pathname === '/profile' ? 'text-white font-semibold' : ''}`} href="/profile">Profile</Link>
                <button
                  className="text-white/90 hover:text-white transition-colors"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.href = '/login'
                  }}
                >
                  Logout
                </button>
                {role === 'student' && (
                  <Link className={`text-white/90 hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-white font-semibold' : ''}`} href="/dashboard">Dashboard</Link>
                )}
                {role === 'teacher' && (
                  <Link className={`text-white/90 hover:text-white transition-colors ${pathname === '/teacher' ? 'text-white font-semibold' : ''}`} href="/teacher">Teacher</Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
