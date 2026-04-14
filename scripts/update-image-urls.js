/**
 * Script thay thế URL ảnh từ chanan.vn sang Cloudinary
 * Chạy: npx ts-node scripts/update-image-urls.ts
 */

import fs from 'fs';

const cloudinaryUrls = JSON.parse(fs.readFileSync('./cloudinary-urls.json', 'utf-8'));

// Tạo map từ original URL → cloudinary URL
const urlMap = {};
cloudinaryUrls.forEach(item => {
  // Thêm cả URL gốc và URL thumbs
  urlMap[item.original] = item.cloudinary;
  
  // Thêm URL thumbs nếu có pattern thumbs/320x230x1
  if (item.original.includes('/thumbs/')) {
    urlMap[item.original] = item.cloudinary;
  }
});

console.log('📋 URL Mapping loaded:', Object.keys(urlMap).length, 'images');

// Đọc và update các file
const filesToUpdate = [
  './data/products.json',
  './prisma/seed.ts',
  './app/components/ProductSlider.js',
  './app/components/HeroBanner.js',
  './data/product_details.json',
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    let replacedCount = 0;

    for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
      if (content.includes(oldUrl)) {
        content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
        replacedCount++;
      }
    }

    if (replacedCount > 0) {
      fs.writeFileSync(file, content);
      console.log(`✅ Updated ${file}: ${replacedCount} URLs replaced`);
    }
  }
}

console.log('\n✅ Hoàn thành cập nhật URL ảnh!');