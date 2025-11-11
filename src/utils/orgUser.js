import { useEffect } from 'react';
import { create } from 'zustand';
import Api  from '../utils/api';

// Create the store
export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({user}),
}))


export const useFetchOrgUser = () => {
    const {user, setUser} = useUserStore()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await Api.get('/organization/org/users');
                // console.log('Fetched organization for user:', response.data);
                setUser(response.data.data);
            } catch (error) {
                console.error('Failed to fetch organization user:', error);
            }
        };
        fetchUser();
    }, []); // Empty dependency array ensures this runs once on mount
    
    return user;
}