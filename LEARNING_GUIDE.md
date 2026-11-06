# Hướng dẫn học Redux qua Tour Dashboard

## 1. Mục tiêu

Project này giúp bạn học đúng luồng cơ bản:

Click hoặc submit form
→ tạo action
→ dispatch action
→ slice reducer xử lý
→ store chứa state mới
→ selector đọc state
→ React render lại.

Không có backend thật. Danh sách tour nằm trong Redux store và được sao lưu vào localStorage.

## 2. Thứ tự đọc file

1. src/features/tours/tour.types.ts
2. src/features/tours/tourSeed.ts
3. src/features/tours/toursSlice.ts
4. src/app/store.ts
5. src/app/hooks.ts
6. src/features/tours/toursSelectors.ts
7. src/main.tsx
8. src/App.tsx
9. src/components/TourForm.tsx
10. src/components/TourTable.tsx

## 3. Vai trò từng khu vực

### app

Chứa hạ tầng Redux dùng cho toàn ứng dụng.

- store.ts tạo store, gắn toursReducer vào key tours và khai báo RootState/AppDispatch.
- hooks.ts tạo useAppDispatch và useAppSelector có type.

### features/tours

Chứa toàn bộ nghiệp vụ quản lý tour.

- tour.types.ts mô tả dữ liệu.
- tourSeed.ts cung cấp dữ liệu ban đầu.
- toursSlice.ts chứa state, action creators và reducers.
- toursSelectors.ts là lớp đọc và tính dữ liệu từ store.

### components

Chứa giao diện có thể tái sử dụng.

- TourForm giữ draft form bằng useState.
- TourTable chỉ nhận props và phát sự kiện qua callback.

## 4. State shape

Root state có dạng:

    {
      tours: {
        items: Tour[],
        search: string,
        statusFilter: "all" | "active" | "hidden"
      }
    }

Key tours xuất hiện vì store đăng ký:

    reducer: {
      tours: toursReducer
    }

Vì vậy selector đọc state.tours.items.

## 5. Action và reducer

createSlice tự sinh action creator.

Khi gọi:

    dispatch(tourDeleted("tour-1"))

Action gần tương đương:

    {
      type: "tours/tourDeleted",
      payload: "tour-1"
    }

Store chuyển action vào tours reducer. Reducer dùng payload để tạo state tiếp theo.

Redux Toolkit dùng Immer nên case reducer được phép viết cú pháp giống mutation trên draft:

    state.items.unshift(action.payload)

Previous state thật không bị sửa.

## 6. Luồng thêm tour

1. Người dùng bấm Thêm tour mới.
2. App đặt formOpen thành true. Đây là UI state cục bộ.
3. TourForm hiển thị và giữ dữ liệu đang gõ bằng useState.
4. Submit kiểm tra dữ liệu.
5. TourForm gọi onSubmit(form).
6. App gọi dispatch(tourAdded(data)).
7. prepare callback tạo id, bookings và createdAt.
8. reducer thêm payload vào items.
9. store thông báo subscriber.
10. selectVisibleTours chạy lại.
11. App nhận danh sách mới và TourTable render lại.
12. store.subscribe lưu items vào localStorage.

## 7. Luồng sửa tour

1. TourTable gọi onEdit(tour).
2. App lưu tour vào editingTour.
3. TourForm copy dữ liệu tour sang draft local.
4. Người dùng sửa nhưng Redux state chưa thay đổi.
5. Khi submit, App dispatch tourUpdated.
6. Reducer tìm tour theo id và gán changes lên Immer draft.
7. Selector và giao diện nhận state mới.

Điểm cần nhớ: draft đang gõ là local state; dữ liệu đã lưu mới là Redux state.

## 8. Luồng xóa tour

TourTable không dispatch trực tiếp. Nó báo ý định lên App:

    onDelete(tour)

App mở dialog. Chỉ khi người dùng xác nhận, App mới dispatch:

    tourDeleted(tour.id)

Cách này tách component trình bày khỏi quyết định nghiệp vụ.

## 9. Selector

Selector cơ bản chỉ lấy dữ liệu:

    const selectTours = state => state.tours.items

selectVisibleTours là selector dẫn xuất. Nó tính danh sách từ items, search và statusFilter.

Không lưu visibleTours vào store vì nó có thể tính lại. Nếu lưu cả items và visibleTours, hai nguồn dữ liệu có thể bị lệch.

createSelector ghi nhớ kết quả theo reference đầu vào. Khi các input không đổi, nó có thể trả lại kết quả trước.

## 10. TypeScript quan trọng

Tour là model đã lưu đầy đủ.

TourFormData dùng Pick để chỉ lấy các trường người dùng được nhập.

PayloadAction<T> quy định kiểu payload của action.

Hàm updateField dùng generic:

    function updateField<K extends keyof TourFormData>(
      key: K,
      value: TourFormData[K]
    )

Nếu key là price thì value phải là number. Nếu key là name thì value phải là string.

Input HTML luôn trả string, kể cả type number. Vì vậy project dùng Number(event.target.value).

## 11. Vì sao một số state không nằm trong Redux

formOpen, editingTour và deleteTarget chỉ phục vụ một màn hình, nên App giữ bằng useState.

Dữ liệu tour, search và filter được nhiều phần giao diện sử dụng nên đặt trong Redux.

Quy tắc thực hành:

- UI state nhỏ, tạm thời: useState.
- State nghiệp vụ dùng chung: Redux.
- Dữ liệu tính được từ state: selector.

## 12. Bài tập nên làm theo thứ tự

### Bài 1

Xóa reducer tourStatusToggled rồi tự viết lại.

### Bài 2

Thêm action bookingsIncreased nhận tour id và tăng bookings nhưng không vượt maxGroupSize.

### Bài 3

Thêm trường category gồm adventure, beach và culture. Cập nhật form và bộ lọc.

### Bài 4

Viết selector selectMostBookedTour trả tour có bookings lớn nhất.

### Bài 5

Thêm nút Đặt lại dữ liệu mẫu. Không sửa seedTours trực tiếp.

### Bài 6

Tách phần sidebar từ App.tsx thành DashboardSidebar.tsx.

### Bài 7

Cài Redux DevTools và giải thích action, payload, previous state, next state khi thêm tour.

## 13. Câu hỏi tự kiểm tra

1. Redux state nằm ở file nào?
2. createSlice tạo ra những gì?
3. action khác action creator thế nào?
4. dispatch có trực tiếp sửa state không?
5. reducer nhận hai dữ liệu nào?
6. tại sao selector không được sửa state?
7. tại sao form draft không cần Redux?
8. prepare callback dùng để làm gì?
9. RootState được suy luận như thế nào?
10. khi filter thay đổi, vì sao TourTable render lại?

## 14. Cách chạy

    npm install
    npm run dev

Mở địa chỉ Vite hiển thị trong terminal.

Build kiểm tra TypeScript:

    npm run build
