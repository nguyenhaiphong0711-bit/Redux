import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const selectTours = (state: RootState) =>
  state.tours.items;

export const selectSearch = (state: RootState) =>
  state.tours.search;

export const selectStatusFilter = (state: RootState) =>
  state.tours.statusFilter;

export const selectVisibleTours = createSelector(
  [selectTours, selectSearch, selectStatusFilter],
  (tours, search, statusFilter) => {
    const keyword = search.trim().toLowerCase();

    return tours.filter((tour) => {
      const matchesKeyword =
        tour.name.toLowerCase().includes(keyword) ||
        tour.destination.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        tour.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  },
);

export const selectTourStatistics = createSelector(
  [selectTours],
  (tours) => ({
    total: tours.length,
    active: tours.filter(
      (tour) => tour.status === "active",
    ).length,
    hidden: tours.filter(
      (tour) => tour.status === "hidden",
    ).length,
    bookings: tours.reduce(
      (total, tour) => total + tour.bookings,
      0,
    ),
  }),
);
