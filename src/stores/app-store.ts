import { Title } from '@/services';
import { create } from 'zustand';

type AppState = {
  loading: boolean;
  error: string;
  myList: Title[];

  setLoading: (value: boolean) => void;
  setError: (value: string) => void;

  addToList: (movie: Title) => void;
  removeFromList: (id: string) => void;

  clearError: () => void;
};

export const appStore = create<AppState>((set) => ({
  loading: false,
  error: '',
  myList: [],

  setLoading: (value) => set({ loading: value }),
  setError: (value) => set({ error: value }),
  addToList: (movie) =>
    set((state) => {
      const alreadyExists = state.myList.find((m) => m.id === movie.id);

      if (alreadyExists) return state;

      return { myList: [...state.myList, movie] };
    }),
  removeFromList: (id) =>
    set((state) => ({
      myList: state.myList.filter((movie) => movie.id !== id),
    })),

  clearError: () => set({ error: '' }),
}));
