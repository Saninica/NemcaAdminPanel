import { create } from 'zustand';
import { persist , createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '../types/auth';
import axiosInstance from '../api/axiosInstance';

interface AuthStore extends AuthState {
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: async (token: string, user: User) => {

        set({ token, user, isAuthenticated: true })
      },
      logout: async () => set({ token: null, user: null, isAuthenticated: false }),
      checkAuthStatus: async () => {
        try {
          const response = await axiosInstance.get("user/", {  
            headers: {
              'Authorization': `Bearer ${get().token}`,
            }
          });
          
          if (response.status === 200) {
            const userData = response.data; 
            if (get().isAuthenticated !== true || get().user !== userData.detail) {
              set({ isAuthenticated: true, user: userData.detail });
            }
          } else {
            if (get().isAuthenticated !== false || get().user !== null || get().token !== null) {
              set({ isAuthenticated: false, user: null, token: null });
            }
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
          if (get().isAuthenticated !== false || get().user !== null || get().token !== null) {
            set({ isAuthenticated: false, user: null, token: null });
          }
        }
      }
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }), // Specify fields to persist
    }
  )
);

export default useAuthStore;
