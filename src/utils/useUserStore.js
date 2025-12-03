import { create  } from 'zustand';
import { useEffect } from 'react';
import Api  from '../utils/api';

export const useUserStore = create((set) => ({
  perUser: null,
  setUser: (perUser) => set({perUser}),
}))


export const useFetchUser = () => {
    const {perUser, setUser} = useUserStore()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await Api.get('/user/profile');
                // console.log('Fetched organization for user:', response.data);
                setUser(response.data.data);
            } catch (error) {
                console.error('Failed to fetch organization user:', error);
            }
        };
        fetchUser();
    }, []); // Empty dependency array ensures this runs once on mount
    
    return perUser;
}