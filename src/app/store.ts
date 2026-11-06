import { configureStore } from "@reduxjs/toolkit";
import toursReducer from "../features/tours/toursSlice";
import { seedTours } from "../features/tours/tourSeed";
import type { Tour } from "../features/tours/tour.types";

const STORAGE_KEY = "tour-dashboard-redux-v1";

function loadTours(): Tour[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Tour[]) : seedTours;
  } catch {
    return seedTours;
  }
}

export const store = configureStore({
  reducer: {
    tours: toursReducer,
  },
  preloadedState: {
    tours: {
      items: loadTours(),
      search: "",
      statusFilter: "all",
    },
  },
});

store.subscribe(() => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(store.getState().tours.items),
  );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
