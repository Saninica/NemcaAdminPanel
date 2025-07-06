import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User, LoginCredentials } from '../types/auth';
import { ApiError } from '../types/api';
import axiosInstance from '../api/axiosInstance';

interface AuthStore extends AuthState {
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  
  // Internal methods
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthData: (token: string, user: User) => void;
  clearAuthData: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Internal setters
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      setAuthData: (token: string, user: User) => 
        set({ token, user, isAuthenticated: true, error: null }),
      clearAuthData: () => 
        set({ token: null, user: null, isAuthenticated: false, error: null }),

      // Actions
      clearError: () => set({ error: null }),

      login: async (credentials: LoginCredentials) => {
        const { setLoading, setError, setAuthData } = get();
        
        try {
          setLoading(true);
          setError(null);

          const response = await axiosInstance.post('/user/login/', 
            new URLSearchParams({
              username: credentials.username,
              password: credentials.password
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );

          if (response.status === 200 && response.data) {
            const { access_token, user } = response.data;
            setAuthData(access_token, user);
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          const apiError = error as ApiError;
          const errorMessage = apiError.message || 'Login failed. Please try again.';
          setError(errorMessage);
          throw error; // Re-throw for component handling
        } finally {
          setLoading(false);
        }
      },

      logout: async () => {
        const { setLoading, clearAuthData } = get();
        
        try {
          setLoading(true);
          
          // Note: No logout endpoint in Postman docs, just clear local data
          // If logout endpoint exists on server, it would be called here
        } finally {
          clearAuthData();
          setLoading(false);
        }
      },

      checkAuthStatus: async () => {
        const { token, setLoading, setError, setAuthData, clearAuthData } = get();
        
        if (!token) {
          clearAuthData();
          return;
        }

        try {
          setLoading(true);
          setError(null);

          const response = await axiosInstance.get('/user/');
          
          if (response.status === 200 && response.data) {
            const userData = response.data;
            
            // Only update if data has changed
            const currentUser = get().user;
            if (!currentUser || JSON.stringify(currentUser) !== JSON.stringify(userData)) {
              setAuthData(token, userData);
            }
          } else {
            throw new Error('Invalid user data received');
          }
        } catch (error) {
          const apiError = error as ApiError;
          
          // Only clear auth for certain errors
          if (apiError.status === 401 || apiError.status === 403) {
            clearAuthData();
          } else {
            setError(apiError.message || 'Failed to verify authentication');
          }
        } finally {
          setLoading(false);
        }
      },

      refreshToken: async () => {
        const { token, setLoading, setError, clearAuthData } = get();
        
        if (!token) {
          clearAuthData();
          return;
        }

        try {
          setLoading(true);
          setError(null);

          // Note: No refresh endpoint in Postman docs
          // If refresh is needed, it should be implemented on the server
          // For now, we'll just validate the current token
          await get().checkAuthStatus();
        } catch (error) {
          const apiError = error as ApiError;
          setError(apiError.message || 'Token validation failed');
          clearAuthData();
          throw error;
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Just log rehydration for debugging - avoid automatic state updates
        console.log('Auth store rehydrated', { hasToken: !!state?.token });
      },
    }
  )
);

export default useAuthStore;
