import { MetadataRoute } from 'next';
import { API_URL } from '../config';

const BASE_URL = 'https://alavihospitals.in';

export const dynamic = 'force-dynamic';

// Strips an optional leading slash and an optional "<section>/" prefix from an
// admin-entered SEO slug, mirroring the same normalization every detail page's
// getByUrl lookup already does — so a slug saved as "/foo", "section/foo", or
// "foo" all collapse to the same clean path segment here.
const normalizeSlug = (raw: string | undefined, sectionPrefix: string): string =>
  (raw || '')
    .trim()
    .replace(new RegExp(`^/?(${sectionPrefix}/)?`), '')
    .replace(/\/+$/, '');

async function fetchJson(path: string): Promise<any> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Sitemap: failed to fetch ${path}`, error);
    return null;
  }
}

const toDate = (value: any): Date => {
  const parsed = value ? new Date(value) : null;
  return parsed && !isNaN(parsed.getTime()) ? parsed : new Date();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // --- A. Static pages ---
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'yearly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/specialities`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/doctors`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/second-opinion`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/health-packages`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/vaccinations`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/patients`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  // --- B. Doctors ---
  let doctorRoutes: MetadataRoute.Sitemap = [];
  const doctorsData = await fetchJson('/api/doctors/getAllEnabledDoctors');
  if (doctorsData) {
    const doctors = doctorsData.Items || (Array.isArray(doctorsData) ? doctorsData : []);
    doctorRoutes = doctors
      .filter((doc: any) => doc.url || doc.doctorId)
      .map((doc: any) => ({
        url: `${BASE_URL}/doctors/${doc.url || doc.doctorId}`,
        lastModified: toDate(doc.updatedAt || doc.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  }

  // --- C. Speciality landing pages ---
  let specialityRoutes: MetadataRoute.Sitemap = [];
  const specialityPagesData = await fetchJson('/api/speciality-pages/getAll');
  if (specialityPagesData) {
    const pages = specialityPagesData.Items || (Array.isArray(specialityPagesData) ? specialityPagesData : []);
    specialityRoutes = pages
      .filter((p: any) => p.enabled !== false && p.seoConfig?.url)
      .map((p: any) => ({
        url: `${BASE_URL}/specialities/${normalizeSlug(p.seoConfig.url, 'specialities')}`,
        lastModified: toDate(p.updatedAt || p.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      }));
  }

  // --- D. Treatments ---
  let treatmentRoutes: MetadataRoute.Sitemap = [];
  const treatmentsData = await fetchJson('/api/treatments/getAll');
  if (treatmentsData) {
    const treatments = treatmentsData.Items || (Array.isArray(treatmentsData) ? treatmentsData : []);
    treatmentRoutes = treatments
      .filter((t: any) => t.enabled !== false && t.seoConfig?.url)
      .map((t: any) => ({
        url: `${BASE_URL}/treatments/${normalizeSlug(t.seoConfig.url, 'treatments')}`,
        lastModified: toDate(t.updatedAt || t.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      }));
  }

  // --- E. Second Opinion topics ---
  let secondOpinionRoutes: MetadataRoute.Sitemap = [];
  const secondOpinionsData = await fetchJson('/api/second-opinions/getAllEnabled');
  if (secondOpinionsData) {
    const topics = secondOpinionsData.Items || (Array.isArray(secondOpinionsData) ? secondOpinionsData : []);
    secondOpinionRoutes = topics
      .filter((t: any) => t.seoConfig?.url)
      .map((t: any) => ({
        url: `${BASE_URL}/second-opinion/${normalizeSlug(t.seoConfig.url, 'second-opinion')}`,
        lastModified: toDate(t.updatedAt || t.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  }

  // --- F. Health Packages ---
  let healthPackageRoutes: MetadataRoute.Sitemap = [];
  const healthPackagesData = await fetchJson('/api/health-packages/getAllEnabled');
  if (healthPackagesData) {
    const packages = healthPackagesData.Items || (Array.isArray(healthPackagesData) ? healthPackagesData : []);
    healthPackageRoutes = packages
      .filter((p: any) => p.seoConfig?.url)
      .map((p: any) => ({
        url: `${BASE_URL}/health-packages/${normalizeSlug(p.seoConfig.url, 'health-packages')}`,
        lastModified: toDate(p.updatedAt || p.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  }

  // --- G. Blogs ---
  let blogRoutes: MetadataRoute.Sitemap = [];
  const blogsData = await fetchJson('/api/blogs/getAllBlogs');
  if (blogsData) {
    const blogs = blogsData.Items || (Array.isArray(blogsData) ? blogsData : []);
    blogRoutes = blogs
      .filter((blog: any) => blog.enabled !== false && (blog.url || blog.blogId))
      .map((blog: any) => ({
        url: `${BASE_URL}/blog/${normalizeSlug(blog.url, 'blog') || blog.blogId}`,
        lastModified: toDate(blog.updatedAt || blog.createdAt || blog.timeline),
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      }));
  }

  // --- Combine everything ---
  return [
    ...staticRoutes,
    ...specialityRoutes,
    ...doctorRoutes,
    ...treatmentRoutes,
    ...secondOpinionRoutes,
    ...healthPackageRoutes,
    ...blogRoutes,
  ];
}
