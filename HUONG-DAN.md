# Hướng dẫn tự sửa trang "Gửi cậu"

## Các file trong thư mục

| File | Dùng để làm gì | Có cần sửa không |
|---|---|---|
| `noi-dung.js` | Toàn bộ chữ, ảnh, mã khoá, lá thư | **Có, sửa file này là chính** |
| `anh/` | Thư mục để ảnh của cậu | Chép ảnh vào đây |
| `index.html` | Khung trang | Không cần |
| `style.css` | Màu sắc, font, kiểu dáng | Chỉ khi muốn đổi màu |
| `script.js` | Hiệu ứng, âm thanh, chuyển trang | Không cần |

## Xem thử

Bấm đúp vào `index.html`, trang sẽ mở trong trình duyệt. Sửa xong file nào thì lưu lại rồi bấm F5 để tải lại trang.

## Đổi chữ

Mở `noi-dung.js` bằng Notepad hoặc VS Code. Sửa chữ nằm giữa hai dấu `"..."`.

- Giữ nguyên dấu `,` ở cuối mỗi dòng.
- Không xoá các dấu `{ }`, `[ ]`.
- Nếu chữ có dấu nháy kép `"` thì viết thành `\"`.

## Lọ sao giấy (cảnh 2)

Mỗi dòng trong `saoGiay` là lời nhắn của một ngôi sao. Thêm bớt bao nhiêu dòng cũng được, mỗi dòng nằm trong dấu `"..."` và có dấu `,` ở cuối:
```js
saoGiay: [
  "Ngày 12.10, lần đầu tụi mình gặp nhau",
  "Lời nhắn mới của cậu",
],
```
Lời nhắn nên ngắn, khoảng 1–2 dòng là đẹp nhất.

## Thêm ảnh (cuộn phim, cảnh 3)

1. Chép ảnh vào thư mục `anh`, ví dụ `anh/1.jpg`.
2. Mở `noi-dung.js` và điền tên file vào chỗ `anh: ""` trong `cuonPhim`:
   ```js
   { anh: "anh/1.jpg", chuThich: "Ly cà phê cậu chê đắng" },
   ```
3. Ảnh vuông hiển thị đẹp nhất. Ảnh khác tỉ lệ sẽ tự cắt bớt cho vừa khung.
4. Tên file nên viết không dấu, không khoảng trắng (ví dụ `di-dao.jpg`).
5. Mỗi ảnh nên dưới 1MB để trang mở nhanh trên điện thoại.

Cuộn phim có bao nhiêu tấm cũng được. Muốn thêm tấm thì chép thêm một dòng:
```js
{ anh: "anh/5.jpg", chuThich: "Chú thích mới" },
```

## Mã khoá

`maKhoa` phải đúng **4 chữ số**, ví dụ ngày 12 tháng 10 thì ghi `"1210"`. Nhớ sửa luôn ngôi sao ghi ngày trong `saoGiay` và `goiYKhoa` cho khớp, để crush có manh mối mà đoán.

Crush nhập sai 2 lần thì hiện gợi ý `goiYKhoa2`. Sai 4 lần thì trang tự điền sẵn 2 số đầu, nên không lo bị kẹt.

## Chỗ viết nhầm rồi gạch đi trong lá thư

Trong `laThu`, viết `{chữ sai|chữ đúng}`. Ví dụ `Tớ {quý|thích} cậu` sẽ gõ chữ "quý", gạch đi, rồi viết "thích".

## Đổi màu

Mở `style.css`, sửa các dòng đầu trong `:root`:
- `--blush`: hồng nhạt (nền cảnh hoa)
- `--rose`: hồng đậm (màu nhấn)
- `--wine`: đỏ rượu (chữ)
- `--gold`: vàng (nhuỵ hoa, ánh sao)
- `--dusk`: tím đêm (nền màn khoá)

## Đưa lên mạng để gửi link cho crush

Cách dễ nhất là **Netlify Drop**:
1. Vào trang app.netlify.com/drop.
2. Kéo cả thư mục `web-crush` thả vào trang.
3. Netlify sẽ đưa cho cậu một đường link để gửi cho crush.

Cũng có thể dùng GitHub Pages nếu cậu đã có tài khoản GitHub.

## Lỗi thường gặp

- **Trang trắng hoặc chữ không hiện:** thường do lỡ xoá dấu phẩy hoặc dấu ngoặc trong `noi-dung.js`. Bấm F12, mở tab Console để xem dòng nào bị lỗi.
- **Ảnh không hiện:** kiểm tra tên file, kể cả chữ hoa hay thường (`Anh1.JPG` khác `anh1.jpg`).
- **Không có tiếng:** trình duyệt chỉ cho phát âm thanh sau khi người xem chạm vào trang. Bấm nút "Kéo màn" là có tiếng.
