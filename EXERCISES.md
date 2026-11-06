# Bài tập Redux tiếp theo

Không xem lời giải trước. Mỗi bài nên quan sát Redux DevTools.

## Mức 1 — reducer cơ bản

1. Viết bookingsIncreased.
2. Viết bookingsDecreased.
3. Không cho bookings nhỏ hơn 0 hoặc lớn hơn maxGroupSize.
4. Viết allToursShown để chuyển mọi tour thành active.

## Mức 2 — selector

1. selectActiveTours.
2. selectHiddenTours.
3. selectTotalRevenue giả lập bằng price nhân bookings.
4. selectToursByDestination nhận destination.
5. selectAlmostFullTours tìm tour còn tối đa 3 chỗ.

## Mức 3 — TypeScript

1. Thêm TourCategory union.
2. Tạo TourSummary bằng Pick.
3. Tạo NewTour bằng Omit.
4. Viết type guard kiểm tra dữ liệu đọc từ localStorage.
5. Không dùng any hoặc ép kiểu tùy tiện.

## Mức 4 — kiến trúc

1. Tách Sidebar.
2. Tách StatsGrid.
3. Tách TourFilters.
4. Di chuyển logic localStorage ra toursStorage.ts.
5. Viết test cho reducer và selector.

## Mức 5 — async sau khi đã vững

1. Thay seed bằng API giả lập.
2. Tạo fetchTours bằng createAsyncThunk.
3. Thêm idle/loading/success/error.
4. Hiển thị loading, empty và error.
5. Sau đó thử chuyển phần tải dữ liệu sang RTK Query.
