import {
  Eye,
  EyeOff,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Tour } from "../features/tours/tour.types";

type TourTableProps = {
  tours: Tour[];
  onEdit: (tour: Tour) => void;
  onDelete: (tour: Tour) => void;
  onToggleStatus: (id: string) => void;
};

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export function TourTable({
  tours,
  onEdit,
  onDelete,
  onToggleStatus,
}: TourTableProps) {
  if (tours.length === 0) {
    return (
      <div className="empty-state">
        <MapPin />
        <h3>Không tìm thấy tour</h3>
        <p>Hãy đổi bộ lọc hoặc tạo một tour mới.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tour</th>
            <th>Giá</th>
            <th>Thời lượng</th>
            <th>Đã đặt</th>
            <th>Trạng thái</th>
            <th aria-label="Thao tác" />
          </tr>
        </thead>

        <tbody>
          {tours.map((tour) => (
            <tr key={tour.id}>
              <td>
                <strong>{tour.name}</strong>
                <span>
                  <MapPin /> {tour.destination}
                </span>
              </td>

              <td>{currency.format(tour.price)}</td>
              <td>{tour.duration} ngày</td>
              <td>
                {tour.bookings}/{tour.maxGroupSize}
              </td>

              <td>
                <span className={"status " + tour.status}>
                  {tour.status === "active"
                    ? "Hoạt động"
                    : "Đã ẩn"}
                </span>
              </td>

              <td>
                <div className="row-actions">
                  <button
                    title={
                      tour.status === "active"
                        ? "Ẩn tour"
                        : "Hiện tour"
                    }
                    onClick={() =>
                      onToggleStatus(tour.id)
                    }
                  >
                    {tour.status === "active" ? (
                      <EyeOff />
                    ) : (
                      <Eye />
                    )}
                  </button>

                  <button
                    title="Sửa tour"
                    onClick={() => onEdit(tour)}
                  >
                    <Pencil />
                  </button>

                  <button
                    className="danger"
                    title="Xóa tour"
                    onClick={() => onDelete(tour)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
