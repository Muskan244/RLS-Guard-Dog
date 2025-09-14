'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

type UserContextType = {
    user: User | null
    loading: boolean
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
})

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null)
            setLoading(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)