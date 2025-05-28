export const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://maadanei-shanel-backend.onrender.com"
    : "http://localhost:5000");
