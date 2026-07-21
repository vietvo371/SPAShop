# Deploy lên VPS

Domain thật: https://suckhoetaman.com
Thư mục trên VPS: /home/suckhoetaman.com/public_html
App chạy bằng pm2, tên process `suckhoetaman`, cổng 3001 (LiteSpeed proxy vào).


## 1. Trên máy local

```bash
git add .
git commit -m "your message"
git push origin main
```


## 2. Trên VPS — deploy

Chạy **nền** bằng `nohup` để SSH có rớt giữa chừng thì build vẫn tiếp tục.
Build mất ~3 phút, lâu hơn thời gian SSH hay bị timeout.

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd /home/suckhoetaman.com/public_html

nohup bash -c 'git pull origin main && npm run build && pm2 restart all' > /tmp/deploy.log 2>&1 &
echo "Dang deploy nen (PID $!)"
```

Chờ ~4 phút rồi kiểm tra (đăng nhập lại cũng xem được):

```bash
tail -20 /tmp/deploy.log
```

Thấy dòng `[PM2] [suckhoetaman](0) ✓` ở cuối là xong.


## 3. Kiểm tra sau deploy

```bash
sleep 10   # chờ Next khởi động, restart xong mà gọi ngay sẽ dính 503

curl -s -o /dev/null -w "trang chu: %{http_code}\n" https://suckhoetaman.com/
curl -s -o /dev/null -w "san pham : %{http_code}\n" https://suckhoetaman.com/san-pham
```

Kiểm tra toàn bộ URL trong sitemap (nên chạy sau các thay đổi lớn):

```bash
curl -s https://suckhoetaman.com/sitemap.xml | grep -oE '<loc>[^<]*' | sed 's/<loc>//' \
| while read u; do
    printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' "$u")" "$u"
  done | grep -v "^200" || echo "Tat ca 200 OK"
```


## 4. Trường hợp đặc biệt

**Thay đổi dependencies** (`package.json`):
```bash
nohup bash -c 'git pull origin main && npm install && npm run build && pm2 restart all' > /tmp/deploy.log 2>&1 &
```

**Thay đổi Prisma schema** (`prisma/schema.prisma`):
```bash
nohup bash -c 'git pull origin main && npx prisma db push && npm run build && pm2 restart all' > /tmp/deploy.log 2>&1 &
```

**Thay đổi `next.config.mjs`**: bắt buộc build lại. Next đóng băng config vào
`.next/required-server-files.json` lúc build — `pm2 restart` không đủ.


## 5. KHÔNG dùng `rm -rf .next` trong deploy thường ngày

Đây là nguyên nhân sự cố ngày 21/07/2026: xoá `.next` trong khi tiến trình cũ
vẫn đang chạy khiến nó không nạp được các chunk chưa có sẵn trong bộ nhớ, gây
lỗi 500 ở trang chi tiết sản phẩm suốt thời gian build (~3 phút). Node ghi nhớ
lần tìm module thất bại nên lỗi không tự khỏi sau đó.

Chỉ build sạch khi thật sự cần (đổi phiên bản Next, build lỗi lạ), và làm khi
ít khách truy cập:

```bash
nohup bash -c 'rm -rf .next node_modules/.cache && npm run build && pm2 restart all' > /tmp/deploy.log 2>&1 &
```


## 6. Xử lý sự cố

**`pm2: command not found`** — chưa nạp NVM trong session mới:
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

**`git pull` báo "local changes would be overwritten"** — VPS có sửa đổi local
chặn pull. Xem file nào rồi bỏ bản local (nhớ sao lưu nếu cần):
```bash
git status
cp <file> /tmp/<file>.bak && git checkout -- <file>
```

**Site trả 503 toàn bộ** — app không chạy. Kiểm tra:
```bash
pm2 status                       # bảng trống = daemon mất process
pm2 logs suckhoetaman --lines 50 --nostream
pm2 resurrect                    # nạp lại từ dump đã lưu
```

**Trang lẻ trả 500** — xem lỗi thật:
```bash
tail -n 80 ~/.pm2/logs/suckhoetaman-error.log
```

**Ảnh Cloudinary không hiện, `/_next/image` trả 400 `"url" parameter is not
allowed`** — host chưa nằm trong `images.remotePatterns` của config **đang
chạy**. Kiểm tra bản build có nuốt config chưa:
```bash
grep -o 'res.cloudinary.com' .next/required-server-files.json || echo "build cu -> build lai"
```
Cũng kiểm tra không có file `next.config.js` thừa: Next ưu tiên `.js` hơn
`.mjs`, một file `.js` sót lại sẽ khiến toàn bộ `next.config.mjs` bị bỏ qua.


## 7. Nên làm một lần

Để VPS reboot thì app tự bật lại (tránh 503 toàn site):
```bash
pm2 save
pm2 startup      # in ra 1 lệnh sudo -> chạy lệnh đó
```

Khỏi phải load NVM thủ công mỗi lần đăng nhập:
```bash
echo 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
```
