import products from "@/data/products.json";
import services from "@/data/services.json";
import articles from "@/data/articles.json";

const BASE_URL = "https://chanan.vn";

export default async function sitemap() {
  const productUrls = products.map((product) => ({
    url: `${BASE_URL}/san-pham/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const serviceUrls = services.map((service) => ({
    url: `${BASE_URL}/dich-vu-cham-soc/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const articleUrls = articles.map((article) => ({
    url: `${BASE_URL}/kien-thuc/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/san-pham`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/dich-vu-cham-soc`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/kien-thuc`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cau-chuyen-chan-an`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tu-van-lieu-trinh`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/lien-he`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/dat-lich-hen`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...productUrls,
    ...serviceUrls,
    ...articleUrls,
  ];
}