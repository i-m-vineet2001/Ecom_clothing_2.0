
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import Categories from "./pages/Categories.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardOverview from "./pages/dashboard/DashboardOverview.jsx";
import Products from "./pages/dashboard/Products.jsx";
import DashboardCategories from "./pages/dashboard/DashboardCategories.jsx";
import Discounts from "./pages/dashboard/Discounts.jsx";
import Enquiries from "./pages/dashboard/Enquiries.jsx";
import AuditLogs from "./pages/dashboard/AuditLogs.jsx";
import Users from "./pages/dashboard/Users.jsx";
import Inventory from "./pages/dashboard/Inventory.jsx";
import Feedback from "./pages/dashboard/Feedback.jsx";
import Settings from "./pages/dashboard/Settings.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/catalog"
            element={
              <PublicLayout>
                <Catalog />
              </PublicLayout>
            }
          />

          {/* All categories browse */}
          <Route
            path="/categories"
            element={
              <PublicLayout>
                <Categories />
              </PublicLayout>
            }
          />

          {/* Individual category page — /category/:slug */}
          <Route
            path="/category/:slug"
            element={
              <PublicLayout>
                <CategoryPage />
              </PublicLayout>
            }
          />

          {/* Product detail */}
          <Route
            path="/product/:id"
            element={
              <PublicLayout>
                <ProductDetail />
              </PublicLayout>
            }
          />

          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "shopowner"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<DashboardCategories />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="users" element={<Users />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;