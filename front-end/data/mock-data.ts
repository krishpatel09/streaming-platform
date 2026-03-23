export interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  category: "Movie" | "Show" | "Episode";
  language: string;
  releaseYear: number;
  status: "Active" | "Scheduled" | "Draft";
  rating?: number;
  views?: string;
  duration?: string;
  seasons?: number;
  totalEpisodes?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "Basic" | "Premium" | "VIP" | "None";
  status: "Active" | "Blocked";
  joinedDate: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  activeUsers: number;
}

export interface Review {
  id: string;
  userName: string;
  contentTitle: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockStats: StatCardProps[] = [
  { title: "Total Users", value: "24.5k", change: "+12% from last month", trend: "up" },
  { title: "Active Users", value: "12,234", change: "+5% increase", trend: "up" },
  { title: "Total Content", value: "1,450", change: "+12 newly added", trend: "up" },
  { title: "Revenue", value: "$45,231", change: "+18.2% growth", trend: "up" },
];

export const mockMovies: ContentItem[] = [
  { id: "m1", title: "Interstellar", thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=225&fit=crop", category: "Movie", language: "English", releaseYear: 2014, status: "Active", rating: 4.8, views: "1.2M" },
  { id: "m2", title: "Inception", thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop", category: "Movie", language: "English", releaseYear: 2010, status: "Active", rating: 4.7, views: "2.5M" },
  { id: "m3", title: "The Dark Knight", thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=225&fit=crop", category: "Movie", language: "English", releaseYear: 2008, status: "Active", rating: 4.9, views: "3.1M" },
  { id: "m4", title: "Pulp Fiction", thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=225&fit=crop", category: "Movie", language: "English", releaseYear: 1994, status: "Active", rating: 4.6, views: "1.8M" },
  { id: "m5", title: "The Godfather", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop", category: "Movie", language: "English", releaseYear: 1972, status: "Active", rating: 4.9, views: "2.2M" },
];

export const mockShows: ContentItem[] = [
  { id: "s1", title: "Stranger Things", thumbnail: "https://images.unsplash.com/photo-1627389955805-39401309f984?w=400&h=225&fit=crop", category: "Show", language: "English", releaseYear: 2016, status: "Active", rating: 4.7, views: "850k", seasons: 4, totalEpisodes: 34 },
  { id: "s2", title: "The Boys", thumbnail: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=400&h=225&fit=crop", category: "Show", language: "English", releaseYear: 2019, status: "Active", rating: 4.8, views: "920k", seasons: 3, totalEpisodes: 24 },
  { id: "s3", title: "Breaking Bad", thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop", category: "Show", language: "English", releaseYear: 2008, status: "Active", rating: 5.0, views: "1.5M", seasons: 5, totalEpisodes: 62 },
];

export const mockUsers: User[] = [
  { id: "u1", name: "Alice Johnson", email: "alice@example.com", plan: "Premium", status: "Active", joinedDate: "2024-01-15" },
  { id: "u2", name: "Bob Smith", email: "bob@example.com", plan: "Basic", status: "Active", joinedDate: "2024-02-10" },
  { id: "u3", name: "Charlie Davis", email: "charlie@example.com", plan: "VIP", status: "Active", joinedDate: "2023-11-20" },
  { id: "u4", name: "Diana Prince", email: "diana@amazon.com", plan: "None", status: "Blocked", joinedDate: "2023-12-05" },
  { id: "u5", name: "Evan Wright", email: "evan@example.com", plan: "Premium", status: "Active", joinedDate: "2024-03-01" },
];

export const mockPlans: SubscriptionPlan[] = [
  { id: "p1", name: "Basic", price: "$9.99/mo", features: ["720p Streaming", "1 Screen", "Ads included"], activeUsers: 12450 },
  { id: "p2", name: "Premium", price: "$15.99/mo", features: ["1080p Streaming", "2 Screens", "No Ads"], activeUsers: 8200 },
  { id: "p3", name: "VIP", price: "$24.99/mo", features: ["4K + HDR Streaming", "4 Screens", "Offline Downloads"], activeUsers: 3850 },
];

export const mockReviews: Review[] = [
  { id: "r1", userName: "John Wick", contentTitle: "Interstellar", rating: 5, comment: "Masterpiece of science fiction!", date: "2024-03-20" },
  { id: "r2", userName: "Sarah Connor", contentTitle: "Stranger Things", rating: 4, comment: "Really captures the 80s vibe.", date: "2024-03-18" },
  { id: "r3", userName: "Luke Skywalker", contentTitle: "The Boys", rating: 4, comment: "Gritty and realistic take on superheroes.", date: "2024-03-15" },
];

export const dailyActiveUsersData = [
  { name: "Mon", users: 4000 },
  { name: "Tue", users: 3000 },
  { name: "Wed", users: 2000 },
  { name: "Thu", users: 2780 },
  { name: "Fri", users: 1890 },
  { name: "Sat", users: 2390 },
  { name: "Sun", users: 3490 },
];

export const revenueGrowthData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 7500 },
];
