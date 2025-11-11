import { create } from 'zustand';

// Define the initial state structure
const initialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
};

// Create the store
const useUserStore = create((set) => ({
    ...initialState, // Spread the initial state

   
    setUser: (userData) => set({
        user: userData,
        isLoggedIn: !!userData,
        loading: false,
    }),

    logout: () => set(initialState),

    // Action to handle loading state
    setLoading: (isLoading) => set({ loading: isLoading }),
}));

export default useUserStore;