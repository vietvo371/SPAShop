/**
 * Script upload ảnh lên Cloudinary
 * Chạy: npx ts-node scripts/upload-to-cloudinary.ts
 * Hoặc: node --experimental-specifier-resolution=node scripts/upload-to-cloudinary.ts
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dltbjoii4';
const API_KEY = process.env.CLOUDINARY_API_KEY || '444453744488977';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'RBq5mZu993UgS0eKnS5mNHXqL60';
const UPLOAD_PRESET = 'chanan_unsigned';

const images = [
  // Products
  { url: 'https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-095708-5542.png', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-100131-7118.png', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-102941-9735.png', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-102105-4919.png', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/z73361033731347f36862839737f29aea22d16400563ee-4548.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-100254-2575.png', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-101752-7130.png', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/lot-giay-cd-2688.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-100949-8822.png', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-100552-4302.png', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/2-8908.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/thumbs/320x230x1/upload/product/2-8908.jpg', folder: 'products/thumbs' },
  { url: 'https://www.chanan.vn/upload/product/z7476222384625e24696e652fb629085ff3653f692ad6f-2629.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/untitled-design-15-1761.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/z736405630835941c841933e53659bd6fee3d26634d071-3821.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/3-5845.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/3-5247.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/z7319013453418c06c4c3ead9a4b220e1a830d93d8e4b6-4434.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/z73330194005963e04e11daa0679a2c9c002056d87bdd9-4449.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/lot-giay-cd-8844.jpg', folder: 'products' },
  { url: 'https://www.chanan.vn/upload/product/z7364053668905aff9f9f272b65c724ce9e7f00cf34068-2991.jpg', folder: 'products' },
  
  // Hero/Banner
  { url: 'https://www.chanan.vn/upload/photo/ww-1068.jpg', folder: 'banners' },
];

async function uploadToCloudinary(imageUrl, folder) {
  const formData = new FormData();
  formData.append('file', imageUrl);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', `chanan/${folder}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return response.json();
}

async function main() {
  console.log('🚀 Bắt đầu upload ảnh lên Cloudinary...\n');

  const results = [];

  for (const { url, folder } of images) {
    const filename = url.split('/').pop();
    console.log(`📤 Uploading: ${filename} → ${folder}`);

    try {
      const result = await uploadToCloudinary(url, folder);
      
      if (result.secure_url) {
        console.log(`✅ Done: ${result.secure_url}\n`);
        results.push({
          original: url,
          cloudinary: result.secure_url,
          folder,
          filename,
        });
      } else {
        console.log(`❌ Failed: ${JSON.stringify(result)}\n`);
      }
    } catch (error) {
      console.log(`❌ Error uploading ${filename}: ${error.message}\n`);
    }

    // Delay để tránh rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Lưu mapping vào file
  const fs = await import('fs');
  fs.writeFileSync(
    './cloudinary-urls.json',
    JSON.stringify(results, null, 2)
  );

  console.log('\n✅ Hoàn thành! URL mapping đã lưu vào cloudinary-urls.json');
  console.log(`📊 Đã upload: ${results.length}/${images.length} ảnh`);
}

main().catch(console.error);