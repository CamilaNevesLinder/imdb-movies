import { create } from 'zustand';

type AppState = {
  loading: boolean;
  error: string;

  setLoading: (value: boolean) => void;
  setError: (value: string) => void;

  clearError: () => void;
};

export const appStore = create<AppState>((set) => ({
  loading: false,
  error: '',

  setLoading: (value) => set({ loading: value }),
  setError: (value) => set({ error: value }),

  clearError: () => set({ error: '' }),
}));
