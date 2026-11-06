import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  Tour,
  TourFormData,
  TourStatus,
} from "../features/tours/tour.types";

type TourFormProps = {
  editingTour: Tour | null;
  onSubmit: (data: TourFormData) => void;
  onClose: () => void;
};

const emptyForm: TourFormData = {
  name: "",
  destination: "",
  price: 0,
  duration: 1,
  maxGroupSize: 10,
  status: "active",
  description: "",
};

export function TourForm({
  editingTour,
  onSubmit,
  onClose,
}: TourFormProps) {
  const [form, setForm] =
    useState<TourFormData>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTour) {
      const {
        name,
        destination,
        price,
        duration,
        maxGroupSize,
        status,
        description,
      } = editingTour;

      setForm({
        name,
        destination,
        price,
        duration,
        maxGroupSize,
        status,
        description,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingTour]);

  function updateField<K extends keyof TourFormData>(
    key: K,
    value: TourFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.name.trim() || !form.destination.trim()) {
      setError("Tên tour và điểm đến không được để trống.");
      return;
    }

    if (
      form.price <= 0 ||
      form.duration < 1 ||
      form.maxGroupSize < 1
    ) {
      setError("Giá, số ngày và số người phải lớn hơn 0.");
      return;
    }

    setError("");
    onSubmit({
      ...form,
      name: form.name.trim(),
      destination: form.destination.trim(),
    });
  }

  return (
    <div className="drawer-backdrop">
      <aside className="tour-drawer">
        <div className="drawer-heading">
          <div>
            <span>THÔNG TIN TOUR</span>
            <h2>
              {editingTour ? "Cập nhật tour" : "Thêm tour mới"}
            </h2>
          </div>

          <button onClick={onClose} aria-label="Đóng form">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Tên tour
            <input
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="Ví dụ: Khám phá Hà Giang"
            />
          </label>

          <label>
            Điểm đến
            <input
              value={form.destination}
              onChange={(event) =>
                updateField(
                  "destination",
                  event.target.value,
                )
              }
              placeholder="Hà Giang"
            />
          </label>

          <div className="form-row">
            <label>
              Giá
              <input
                type="number"
                value={form.price}
                onChange={(event) =>
                  updateField(
                    "price",
                    Number(event.target.value),
                  )
                }
              />
            </label>

            <label>
              Số ngày
              <input
                type="number"
                value={form.duration}
                onChange={(event) =>
                  updateField(
                    "duration",
                    Number(event.target.value),
                  )
                }
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Số người tối đa
              <input
                type="number"
                value={form.maxGroupSize}
                onChange={(event) =>
                  updateField(
                    "maxGroupSize",
                    Number(event.target.value),
                  )
                }
              />
            </label>

            <label>
              Trạng thái
              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as TourStatus,
                  )
                }
              >
                <option value="active">Hoạt động</option>
                <option value="hidden">Đã ẩn</option>
              </select>
            </label>
          </div>

          <label>
            Mô tả
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
              rows={4}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={onClose}
            >
              Hủy
            </button>

            <button className="button-primary">
              {editingTour ? "Lưu thay đổi" : "Tạo tour"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
