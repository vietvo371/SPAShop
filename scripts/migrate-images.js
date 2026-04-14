#!/bin/bash
# Script để migrate ảnh từ chanan.vn sang Cloudinary
# Chạy: node scripts/migrate-images.js

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

// Danh sách ảnh cần migrate từ data/products.json và seed.ts
const images = [
  // Từ products.json
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/screenshot-2026-02-22-at-100131-7118.png",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/screenshot-2026-02-22-at-095708-5542.png",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/screenshot-2026-02-22-at-102941-9735.png",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/screenshot-2026-02-22-at-102105-4919.png",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/z7364053668905aff9f9f272b65c724ce9e7f00cf34068-2991.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/screenshot-2026-02-22-at-100254-2575.png",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/screenshot-2026-02-22-at-101752-7130.png",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/lot-giay-cd-2688.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/screenshot-2026-02-22-at-100949-8822.png",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/screenshot-2026-02-22-at-100552-4302.png",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/2-8908.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/z7476222384625e24696e652fb629085ff3653f692ad6f-2629.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/untitled-design-15-1761.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/z736405630835941c841933e53659bd6fee3d26634d071-3821.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/3-5845.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/z73361033731347f36862839737f29aea22d16400563ee-4548.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/3-5247.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/z7319013453418c06c4c3ead9a4b220e1a830d93d8e4b6-4434.jpg",
  "https://www.chanan.vn/thumbs/320x230x1/upload/product/z73330194005963e04e11daa0679a2c9c002056d87bdd9-4449.jpg",

  // Từ seed.ts và các component khác (dùng ảnh full size)
  "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-095708-5542.png",
  "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-100131-7118.png",
  "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-102941-9735.png",
  "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-102105-4919.png",
  "https://www.chanan.vn/upload/product/z73361033731347f36862839737f29aea22d16400563ee-4548.jpg",
  "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-100254-2575.png",
  "https://www.chanan.vn/upload/photo/ww-1068.jpg",
];

// Mapping cũ → mới (sẽ update sau khi upload)
const urlMap = {};

async function migrateImages() {
  console.log("🔄 Bắt đầu migrate ảnh...");

  const dir = './downloaded_images';
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  for (const url of images) {
    const filename = url.split('/').pop();
    const filepath = path.join(dir, filename);

    console.log(`📥 Download: ${filename}`);

    try {
      const response = await fetch(url);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        writeFileSync(filepath, Buffer.from(buffer));
        console.log(`✅ Saved: ${filepath}`);
      } else {
        console.log(`❌ Failed: ${url} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${url} - ${error.message}`);
    }
  }

  console.log("\n✅ Hoàn thành download!");
  console.log("📁 Ảnh đã lưu trong thư mục: ./downloaded_images");
  console.log("\nBước tiếp theo:");
  console.log("1. Upload ảnh lên Cloudinary qua dashboard");
  console.log("2. Cập nhật URL trong code");
}

migrateImages();