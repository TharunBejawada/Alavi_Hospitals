import { MetadataRoute } from 'next';
import { API_URL } from '../config'; 

const BASE_URL = 'https://alavihospitals.in';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/conditions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // --- B. Fetch Dynamic Services ---
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/services/getAllServices`, { cache: 'no-store' });
    const data = await res.json();
    const services = data.Items || (Array.isArray(data) ? data : []);

    serviceRoutes = services.map((service: any) => {
      // Ensure URL format is correct (handle leading slash from DB)
      const slug = service.url.startsWith('/') ? service.url : `/${service.url}`;
      
      return {
        url: `${BASE_URL}/services${slug}`,
        lastModified: new Date(service.createdAt || new Date()),
        changeFrequency: 'monthly',
        priority: 0.9,
      };
    });
  } catch (error) {
    console.error("Sitemap: Failed to fetch services", error);
  }

  // --- C. Fetch Dynamic Blogs ---
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/blogs/getAllBlogs`, { cache: 'no-store' });
    const data = await res.json();
    // Adjust based on your blog API response structure
    const blogs = data.Items || (Array.isArray(data) ? data : []);

    blogRoutes = blogs.map((blog: any) => {
      // Assuming blog object has a 'url' or 'slug' field
      const slug = blog.url.startsWith('/') ? blog.url : `/${blog.url}`;

      return {
        url: `${BASE_URL}/blog${slug}`,
        lastModified: new Date(blog.createdAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error("Sitemap: Failed to fetch blogs", error);
  }

  // --- D. Combine All ---
  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}