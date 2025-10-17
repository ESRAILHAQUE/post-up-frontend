// Mock data for the guest post marketplace

export interface Site {
  id: string;
  name: string;
  url: string;
  description: string;
  domain_authority: number;
  domain_rating: number;
  monthly_traffic: number;
  category: string;
  price: number;
  turnaround_days: number;
  image_url: string;
  featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "user";
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  site_id?: string;
  package_id?: string;
  customer_name: string;
  customer_email: string;
  target_url: string;
  article_topic?: string;
  special_instructions?: string;
  total_amount: number;
  stripe_payment_intent_id: string;
  stripe_charge_id: string;
  paid_at?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  article_url?: string;
  content?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "completed" | "failed" | "refunded";
  stripe_payment_intent_id: string;
  stripe_charge_id: string;
  payment_method: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  order_id: string;
  user_id: string;
  invoice_number: string;
  amount: number;
  status: "unpaid" | "paid" | "cancelled";
  issued_at?: string;
  due_at?: string;
  paid_at?: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featured_image: string;
  category: string;
  author: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  read_time: number;
  status: "draft" | "published";
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  type: "single" | "combo";
  site_ids: string[]; // For combo packages, array of site IDs
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

// Mock Sites Data
export const mockSites: Site[] = [
  {
    id: "1",
    name: "TechCrunch",
    url: "techcrunch.com",
    description: "Leading technology media property",
    domain_authority: 93,
    domain_rating: 91,
    monthly_traffic: 15000000,
    category: "Technology",
    price: 899,
    turnaround_days: 7,
    image_url: "/techcrunch-logo.png",
    featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Forbes",
    url: "forbes.com",
    description: "Business and financial news",
    domain_authority: 95,
    domain_rating: 93,
    monthly_traffic: 120000000,
    category: "Business",
    price: 1299,
    turnaround_days: 5,
    image_url: "/forbes-logo-generic.png",
    featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Entrepreneur",
    url: "entrepreneur.com",
    description: "Startup and business insights",
    domain_authority: 91,
    domain_rating: 89,
    monthly_traffic: 8500000,
    category: "Business",
    price: 749,
    turnaround_days: 7,
    image_url: "/entrepreneur-logo.png",
    featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    full_name: "Admin User",
    role: "admin",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@example.com",
    full_name: "John Doe",
    role: "user",
    created_at: new Date().toISOString(),
  },
];

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: "1",
    user_id: "2",
    site_id: "1",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    target_url: "https://example.com",
    total_amount: 899,
    stripe_payment_intent_id: "pi_mock123",
    stripe_charge_id: "ch_mock123",
    status: "completed",
    article_url: "https://techcrunch.com/sample-article",
    content: "Sample article content",
    paid_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Payments Data
export const mockPayments: Payment[] = [
  {
    id: "1",
    user_id: "2",
    order_id: "1",
    amount: 899,
    currency: "USD",
    status: "completed",
    stripe_payment_intent_id: "pi_mock123",
    stripe_charge_id: "ch_mock123",
    payment_method: "card",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Invoices Data
export const mockInvoices: Invoice[] = [
  {
    id: "1",
    order_id: "1",
    user_id: "2",
    invoice_number: "INV-001",
    amount: 899,
    status: "paid",
    issued_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    due_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    paid_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Blog Posts Data
export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Guest Posting in 2024",
    slug: "ultimate-guide-guest-posting-2024",
    featured_image: "/guest-posting-guide.jpg",
    category: "SEO",
    author: "Sarah Johnson",
    content:
      "<p>Guest posting remains one of the most effective SEO strategies...</p>",
    excerpt: "Learn everything you need to know about guest posting in 2024",
    meta_title: "The Ultimate Guide to Guest Posting in 2024 | PostUp",
    meta_description: "Discover the best practices for guest posting in 2024",
    tags: ["SEO", "Guest Posting", "Link Building"],
    read_time: 8,
    status: "published",
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Packages Data
export const mockPackages: Package[] = [
  {
    id: "1",
    name: "Starter Package",
    description:
      "Perfect for small businesses getting started with guest posting",
    type: "combo",
    site_ids: ["1", "3"],
    original_price: 1648,
    discounted_price: 1299,
    discount_percentage: 21,
    features: [
      "2 High-Authority Guest Posts",
      "DA 90+ Websites",
      "Dofollow Backlinks",
      "7-Day Turnaround",
      "Content Review Included",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Growth Package",
    description: "Ideal for growing businesses looking to scale their SEO",
    type: "combo",
    site_ids: ["1", "2", "3"],
    original_price: 2947,
    discounted_price: 2399,
    discount_percentage: 19,
    features: [
      "3 Premium Guest Posts",
      "DA 90+ Websites",
      "Dofollow Backlinks",
      "Priority Support",
      "5-Day Turnaround",
      "Free Content Optimization",
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// CRUD Functions for Sites
export function getSites(): Site[] {
  return mockSites.filter((site) => site.is_active);
}

export function getSiteById(id: string): Site | undefined {
  return mockSites.find((site) => site.id === id);
}

export function addSite(site: Omit<Site, "id" | "created_at">): Site {
  const newSite: Site = {
    ...site,
    id: String(mockSites.length + 1),
    created_at: new Date().toISOString(),
  };
  mockSites.push(newSite);
  return newSite;
}

export function updateSite(
  id: string,
  updates: Partial<Site>
): Site | undefined {
  const index = mockSites.findIndex((site) => site.id === id);
  if (index === -1) return undefined;
  mockSites[index] = { ...mockSites[index], ...updates };
  return mockSites[index];
}

export function deleteSite(id: string): boolean {
  const index = mockSites.findIndex((site) => site.id === id);
  if (index === -1) return false;
  mockSites.splice(index, 1);
  return true;
}

// CRUD Functions for Orders
export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((order) => order.id === id);
}

export function addOrder(
  order: Omit<Order, "id" | "created_at" | "updated_at">
): Order {
  const newOrder: Order = {
    ...order,
    id: String(mockOrders.length + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockOrders.push(newOrder);
  return newOrder;
}

// CRUD Functions for Payments
export function addPayment(
  payment: Omit<Payment, "id" | "created_at">
): Payment {
  const newPayment: Payment = {
    ...payment,
    id: String(mockPayments.length + 1),
    created_at: new Date().toISOString(),
  };
  mockPayments.push(newPayment);
  return newPayment;
}

// CRUD Functions for Invoices
export function addInvoice(
  invoice: Omit<Invoice, "id" | "created_at">
): Invoice {
  const newInvoice: Invoice = {
    ...invoice,
    id: String(mockInvoices.length + 1),
    created_at: new Date().toISOString(),
  };
  mockInvoices.push(newInvoice);
  return newInvoice;
}

// CRUD Functions for Blog Posts
export function getBlogPosts(): BlogPost[] {
  return mockBlogPosts;
}

export function getPublishedBlogPosts(): BlogPost[] {
  return mockBlogPosts.filter((post) => post.status === "published");
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return mockBlogPosts.find((post) => post.id === id);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return mockBlogPosts.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(
  currentPostId: string,
  category: string,
  limit = 3
): BlogPost[] {
  return mockBlogPosts
    .filter(
      (post) =>
        post.id !== currentPostId &&
        post.category === category &&
        post.status === "published"
    )
    .slice(0, limit);
}

export function addBlogPost(
  post: Omit<BlogPost, "id" | "created_at" | "updated_at">
): BlogPost {
  const newPost: BlogPost = {
    ...post,
    id: String(mockBlogPosts.length + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockBlogPosts.push(newPost);
  return newPost;
}

export function updateBlogPost(
  id: string,
  updates: Partial<BlogPost>
): BlogPost | undefined {
  const index = mockBlogPosts.findIndex((post) => post.id === id);
  if (index === -1) return undefined;
  mockBlogPosts[index] = {
    ...mockBlogPosts[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return mockBlogPosts[index];
}

export function deleteBlogPost(id: string): boolean {
  const index = mockBlogPosts.findIndex((post) => post.id === id);
  if (index === -1) return false;
  mockBlogPosts.splice(index, 1);
  return true;
}

// CRUD Functions for Packages
export function getPackages(): Package[] {
  return mockPackages.filter((pkg) => pkg.is_active);
}

export function getPackageById(id: string): Package | undefined {
  return mockPackages.find((pkg) => pkg.id === id);
}

export function addPackage(pkg: Omit<Package, "id" | "created_at">): Package {
  const newPackage: Package = {
    ...pkg,
    id: String(mockPackages.length + 1),
    created_at: new Date().toISOString(),
  };
  mockPackages.push(newPackage);
  return newPackage;
}

export function updatePackage(
  id: string,
  updates: Partial<Package>
): Package | undefined {
  const index = mockPackages.findIndex((pkg) => pkg.id === id);
  if (index === -1) return undefined;
  mockPackages[index] = { ...mockPackages[index], ...updates };
  return mockPackages[index];
}

export function deletePackage(id: string): boolean {
  const index = mockPackages.findIndex((pkg) => pkg.id === id);
  if (index === -1) return false;
  mockPackages.splice(index, 1);
  return true;
}
