import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {

    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(isSupabaseConfigured);


    async function login(email, password) {
        if (!isSupabaseConfigured) {
            throw new Error('Supabase is not configured. Please add your Supabase credentials to src/supabase.js');
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    }

    async function logout() {
        if (!isSupabaseConfigured) {
            setCurrentUser(null);
            return;
        }
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    useEffect(() => {
        if (!isSupabaseConfigured) {
            return;
        }


        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setCurrentUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setCurrentUser(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        currentUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
