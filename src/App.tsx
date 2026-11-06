import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  Map,
  Menu,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { TourForm } from "./components/TourForm";
import { TourTable } from "./components/TourTable";
import type {
  Tour,
  TourFormData,
} from "./features/tours/tour.types";
import {
  searchChanged,
  statusFilterChanged,
  tourAdded,
  tourDeleted,
  tourStatusToggled,
  tourUpdated,
} from "./features/tours/toursSlice";
import {
  selectSearch,
  selectStatusFilter,
  selectTourStatistics,
  selectVisibleTours,
} from "./features/tours/toursSelectors";

export default function App() {
  const dispatch = useAppDispatch();
  const tours = useAppSelector(selectVisibleTours);
  const statistics = useAppSelector(selectTourStatistics);
  const search = useAppSelector(selectSearch);
  const statusFilter = useAppSelector(selectStatusFilter);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTour, setEditingTour] =
    useState<Tour | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<Tour | null>(null);

  function openCreateForm() {
    setEditingTour(null);
    setFormOpen(true);
  }

  function openEditForm(tour: Tour) {
    setEditingTour(tour);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingTour(null);
  }

  function submitForm(data: TourFormData) {
    if (editingTour) {
      dispatch(
        tourUpdated({
          id: editingTour.id,
          changes: data,
        }),
      );
    } else {
      dispatch(tourAdded(data));
    }

    closeForm();
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    dispatch(tourDeleted(deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>
            <Map />
          </span>
          <div>
            <b>TourSpace</b>
            <small>ADMIN PORTAL</small>
          </div>
        </div>

        <nav>
          <span>KHÔNG GIAN QUẢN LÝ</span>
          <a href="#dashboard">
            <LayoutDashboard /> Tổng quan
          </a>
          <a className="active" href="#tours">
            <Map /> Quản lý tour
          </a>
          <a href="#bookings">
            <CalendarDays /> Lịch đặt tour
          </a>
          <a href="#customers">
            <Users /> Khách hàng
          </a>
        </nav>

        <div className="learning-card">
          <BookOpen />
          <b>Project luyện Redux</b>
          <p>
            Theo dõi action trong Redux DevTools khi bạn
            thêm, sửa hoặc xóa tour.
          </p>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="menu-button">
            <Menu />
          </button>

          <div>
            <span>QUẢN TRỊ VIÊN</span>
            <h1>Quản lý tour</h1>
          </div>

          <button className="profile">
            <span>HP</span>
            <div>
              <b>Hải Phong</b>
              <small>Quản trị viên</small>
            </div>
            <ChevronDown />
          </button>
        </header>

        <section className="page">
          <div className="welcome">
            <div>
              <span>TOUR DASHBOARD</span>
              <h2>Chào buổi sáng, Hải Phong!</h2>
              <p>
                Quản lý danh sách tour và quan sát Redux
                cập nhật giao diện theo từng action.
              </p>
            </div>

            <button
              className="button-primary"
              onClick={openCreateForm}
            >
              <Plus /> Thêm tour mới
            </button>
          </div>

          <div className="stats-grid">
            <article>
              <span className="stat-icon blue">
                <Map />
              </span>
              <div>
                <small>TỔNG SỐ TOUR</small>
                <strong>{statistics.total}</strong>
                <p>Tất cả tour trong store</p>
              </div>
            </article>

            <article>
              <span className="stat-icon green">
                <BarChart3 />
              </span>
              <div>
                <small>ĐANG HOẠT ĐỘNG</small>
                <strong>{statistics.active}</strong>
                <p>Đang hiển thị với khách</p>
              </div>
            </article>

            <article>
              <span className="stat-icon orange">
                <Map />
              </span>
              <div>
                <small>TOUR ĐÃ ẨN</small>
                <strong>{statistics.hidden}</strong>
                <p>Có thể bật lại bất kỳ lúc nào</p>
              </div>
            </article>

            <article>
              <span className="stat-icon violet">
                <Users />
              </span>
              <div>
                <small>LƯỢT ĐẶT TOUR</small>
                <strong>{statistics.bookings}</strong>
                <p>Tổng lượt đặt giả lập</p>
              </div>
            </article>
          </div>

          <section className="content-card">
            <div className="card-heading">
              <div>
                <span>DANH SÁCH TOUR</span>
                <h2>Tour hiện có</h2>
              </div>
              <b>{tours.length} kết quả</b>
            </div>

            <div className="filters">
              <label>
                <Search />
                <input
                  value={search}
                  onChange={(event) =>
                    dispatch(
                      searchChanged(event.target.value),
                    )
                  }
                  placeholder="Tìm theo tên hoặc điểm đến..."
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  dispatch(
                    statusFilterChanged(
                      event.target.value as
                        | "all"
                        | "active"
                        | "hidden",
                    ),
                  )
                }
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="hidden">Đã ẩn</option>
              </select>
            </div>

            <TourTable
              tours={tours}
              onEdit={openEditForm}
              onDelete={setDeleteTarget}
              onToggleStatus={(id) =>
                dispatch(tourStatusToggled(id))
              }
            />
          </section>
        </section>
      </main>

      {formOpen && (
        <TourForm
          editingTour={editingTour}
          onSubmit={submitForm}
          onClose={closeForm}
        />
      )}

      {deleteTarget && (
        <div className="dialog-backdrop">
          <div className="confirm-dialog">
            <span className="danger-icon">!</span>
            <h2>Xóa tour?</h2>
            <p>
              Tour <b>{deleteTarget.name}</b> sẽ bị xóa khỏi
              Redux store. Thao tác này không thể hoàn tác.
            </p>
            <div>
              <button
                className="button-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Hủy
              </button>
              <button
                className="button-danger"
                onClick={confirmDelete}
              >
                Xóa tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
