// src/hooks/useAuthStatus.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuthStatus() {
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const signOutUser = async () => {
        try {
            await auth.signOut();
            // setUser(null); // Optional: Or rely on onAuthStateChanged to update the user state
        } catch (error) {
            console.error("Error signing out: ", error);
            // Handle sign-out errors here
        }
    };

    return { user, loadingAuth, signOutUser };
}