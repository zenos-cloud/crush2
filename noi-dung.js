/* ==========================================================
   FILE NỘI DUNG — cậu chỉ cần sửa file này.
   - Chữ nằm trong dấu "..." hoặc `...` thì sửa thoải mái.
   - Đừng xoá dấu phẩy , ở cuối mỗi dòng và các dấu { } [ ].
   - Ảnh: chép ảnh vào thư mục "anh" rồi ghi tên file, ví dụ "anh/1.jpg".
     Để trống "" thì trang dùng ảnh minh hoạ có sẵn.
   ========================================================== */

window.NOI_DUNG = {
  /* ---- Màn sân khấu mở đầu ---- */
  ten: "Quyên", // tên hoặc biệt danh của crush
  loiChao: "Gửi LeeQZeen", // chữ to trên tấm màn
  loiMoi: "Em chuẩn bị một thứ nhỏ, chỉ dành cho người 'đặc biệt' là chị.",
  nutKeoMan: "Kéo màn",

  /* ---- Cảnh 1: kéo dây bật đèn ---- */
  tieuDeDen: "Bật đèn lên nào",
  huongDanDen: "Kéo sợi dây xuống nhé",
  chuDen: "", // chữ hiện bằng bóng đèn; để trống "" thì dùng tên ở dòng "ten"

  /* ---- Cảnh 2: lọ sao giấy ----
     Mỗi dòng là lời nhắn trong 1 ngôi sao. Thêm/bớt bao nhiêu dòng cũng được.
     Nên giữ 1 ngôi sao ghi ngày gặp nhau, để làm manh mối cho mã khoá ở cảnh 4. */
  tieuDeLo: "Lọ sao giấy của em",
  huongDanLo: "Chạm vào lọ để lấy từng ngôi sao",
  saoGiay: [
    "Lần đầu em gặp chị",
    "Em đã luôn nhớ nụ cười của chị",
    "Nhớ những lần được nói chuyện với chị",
    "Những lần được ngồi cạnh chị",
    "Những lần được đi cùng chị về nhà..\n0304  ",
  ],

  /* ---- Cảnh 3: cuộn phim (thêm/bớt bao nhiêu tấm cũng được) ---- */
  tieuDeCuonPhim: "Những khoảnh khắc em đã không biết đã xem bao nhiêu lần",
  cuonPhim: [
    {
      anh: "./image/0b0bb658-9393-4d7b-892c-576346f5877d.jpg",
      chuThich: "Chị nghĩ em đã thích chị bao lâu rồi..",
    },
    {
      anh: "./image/a483cf20-9571-4501-807f-7152b25994ff.jpg",
      chuThich: "Chắc chị nghĩ là gần đây đúng không...",
    },
    {
      anh: "./image/d915c789-0677-4a58-9674-002b83f5da1b.jpg",
      chuThich: "Nhưng chị có biết rằng em đã giấu kín từ rất lâu rồi..",
    },
    {
      anh: "./image/d75e579b-050b-4cb5-aaa5-2d87a5634987.jpg",
      chuThich: "Ít nhất hơn 1 năm rồi đấyyyy...",
    },
  ],

  /* ---- Cảnh 4: khoá bí mật (đúng 4 chữ số) ---- */
  tieuDeKhoa: "Lá thư này có khoá",
  cauHoiKhoa: "Ngày sinh nhật của chị là ngày nào? (ngày, tháng)",
  maKhoa: "0304",
  goiYKhoa: "Gợi ý: có một ngôi sao trong lọ ghi ngày đó",
  goiYKhoa2: "Gợi ý: 4 số là ngày và tháng ghi trong lọ sao giấy.", // hiện khi nhập sai 2 lần
  // Nhập sai 4 lần thì trang tự điền sẵn 2 số đầu.

  /* ---- Cảnh 5–6: phong bì và lá thư ----
     Viết {chữ sai|chữ đúng} để tạo chỗ viết nhầm rồi gạch đi.
     Xuống dòng bình thường bằng phím Enter. */
  tieuDePhongBi: "Em lại phiền chị mất rồi..",
  kyTenConDau: "Q", // 1 chữ cái in trên con dấu
  laThu: `Gửi LeeQZeen,

Em không giỏi nói mấy lời này trực tiếp, nên em làm hẳn {một bài thơ|một trang web}.

Không biết tại sao hôm nay em lại làm cái này để gửi cho chị, nhưng em chỉ muốn nói
Em {quý|thích} chị. Thích từ lâu rồi.`,
  nutSauThu: "Em chỉ muốn hỏi chị",

  /* ---- Cảnh 7: câu hỏi cuối ---- */
  cauHoi: "Em sẽ không bao giờ có cơ hội đúng không??",
  nutTraLoi: ["Đúng", "Chắc chắn là thế"],
  chuViet: "  Em biết mà", // chữ viết tay hiện ra sau khi bấm
  loiKet:
    "Nhưng mà chị ơi...Không sao đâu chị ạ!! chỉ cần chị vui là được😎😎, em cũng chẳng quan trọng tương lai sẽ thế nào, chị không thích em cũng được, hay thích người khác cũng được, em thích chị là được😝😝,  ",

  /* ---- Âm thanh ---- */
  batAmThanh: true, // false = tắt hết âm thanh lúc mở trang
};
