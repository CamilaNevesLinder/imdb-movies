import { Title } from '@/services';
import { create } from 'zustand';

type AppState = {
  myList: Title[];

  addToList: (movie: Title) => void;
  removeFromList: (id: string) => void;
};

export const MyListStore = create<AppState>((set) => ({
  myList: [],

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
}));
