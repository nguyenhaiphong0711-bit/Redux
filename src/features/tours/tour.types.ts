export type TourStatus = "active" | "hidden";

export type Tour = {
  id: string;
  name: string;
  destination: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  bookings: number;
  status: TourStatus;
  description: string;
  createdAt: string;
};

export type TourFormData = Pick<
  Tour,
  | "name"
  | "destination"
  | "price"
  | "duration"
  | "maxGroupSize"
  | "status"
  | "description"
>;
