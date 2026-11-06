import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Tour, TourFormData, TourStatus } from "./tour.types";

type StatusFilter = "all" | TourStatus;

export type ToursState = {
  items: Tour[];
  search: string;
  statusFilter: StatusFilter;
};

const initialState: ToursState = {
  items: [],
  search: "",
  statusFilter: "all",
};

const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    tourAdded: {
      reducer(state, action: PayloadAction<Tour>) {
        state.items.unshift(action.payload);
      },
      prepare(form: TourFormData) {
        return {
          payload: {
            ...form,
            id: crypto.randomUUID(),
            bookings: 0,
            createdAt: new Date().toISOString(),
          } satisfies Tour,
        };
      },
    },
    tourUpdated(
      state,
      action: PayloadAction<{ id: string; changes: TourFormData }>,
    ) {
      const tour = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (tour) {
        Object.assign(tour, action.payload.changes);
      }
    },
    tourDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (tour) => tour.id !== action.payload,
      );
    },
    tourStatusToggled(state, action: PayloadAction<string>) {
      const tour = state.items.find(
        (item) => item.id === action.payload,
      );

      if (tour) {
        tour.status =
          tour.status === "active" ? "hidden" : "active";
      }
    },
    searchChanged(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    statusFilterChanged(
      state,
      action: PayloadAction<StatusFilter>,
    ) {
      state.statusFilter = action.payload;
    },
  },
});

export const {
  tourAdded,
  tourUpdated,
  tourDeleted,
  tourStatusToggled,
  searchChanged,
  statusFilterChanged,
} = toursSlice.actions;

export default toursSlice.reducer;
