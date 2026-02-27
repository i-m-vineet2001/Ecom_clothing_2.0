// import "./index.css";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
// import { Toaster } from "./components/ui/sonner";
// import Navbar from "./components/Navbar.jsx";
// import Footer from "./components/Footer.jsx";
// import Home from "./pages/Home.jsx";
// import Catalog from "./pages/Catalog.jsx";
// import ProductDetail from "./pages/ProductDetail.jsx";
// import About from "./pages/About.jsx";
// import Login from "./pages/Login.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import DashboardOverview from "./pages/dashboard/DashboardOverview.jsx";
// import Products from "./pages/dashboard/Products.jsx";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!user || !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// const PublicLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">{children}</main>
//       <Footer />
//     </div>
//   );
// };

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Toaster position="top-right" />
//         <Routes>
//           {/* Public Routes */}
//           <Route
//             path="/"
//             element={
//               <PublicLayout>
//                 <Home />
//               </PublicLayout>
//             }
//           />
//           <Route
//             path="/catalog"
//             element={
//               <PublicLayout>
//                 <Catalog />
//               </PublicLayout>
//             }
//           />
//           <Route
//             path="/categories"
//             element={
//               <PublicLayout>
//                 <Catalog />
//               </PublicLayout>
//             }
//           />
//           <Route
//             path="/product/:id"
//             element={
//               <PublicLayout>
//                 <ProductDetail />
//               </PublicLayout>
//             }
//           />
//           <Route
//             path="/about"
//             element={
//               <PublicLayout>
//                 <About />
//               </PublicLayout>
//             }
//           />
//           <Route path="/login" element={<Login />} />

//           {/* Protected Dashboard Routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "shopowner"]}>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<DashboardOverview />} />
//             <Route path="products" element={<Products />} />
//             <Route
//               path="categories"
//               element={
//                 <div className="p-8">
//                   <h1 className="text-2xl font-bold">
//                     Categories - Coming Soon
//                   </h1>
//                 </div>
//               }
//             />
//             <Route
//               path="inventory"
//               element={
//                 <div className="p-8">
//                   <h1 className="text-2xl font-bold">
//                     Inventory - Coming Soon
//                   </h1>
//                 </div>
//               }
//             />
//             <Route
//               path="discounts"
//               element={
//                 <div className="p-8">
//                   <h1 className="text-2xl font-bold">
//                     Discounts - Coming Soon
//                   </h1>
//                 </div>
//               }
//             />
//             <Route
//               path="enquiries"
//               element={
//                 <div className="p-8">
//                   <h1 className="text-2xl font-bold">
//                     Enquiries - Coming Soon
//                   </h1>
//                 </div>
//               }
//             />
//             <Route
//               path="settings"
//               element={
//                 <div className="p-8">
//                   <h1 className="text-2xl font-bold">Settings - Coming Soon</h1>
//                 </div>
//               }
//             />
//             <Route
//               path="users"
//               element={
//                 <div className="p-8">
//                   <h1 className="text-2xl font-bold">Users - Coming Soon</h1>
//                 </div>
//               }
//             />
//             <Route
//               path="audit-logs"
//               element={
//                 <div className="p-8">
//                   <h1 className="text-2xl font-bold">
//                     Audit Logs - Coming Soon
//                   </h1>
//                 </div>
//               }
//             />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;

import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import Categories from "./pages/Categories.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardOverview from "./pages/dashboard/DashboardOverview.jsx";
import Products from "./pages/dashboard/Products.jsx";
import DashboardCategories from "./pages/dashboard/DashboardCategories.jsx";

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

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

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
          {/* Public Categories Browse Page */}
          <Route
            path="/categories"
            element={
              <PublicLayout>
                <Categories />
              </PublicLayout>
            }
          />
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

          {/* Protected Dashboard Routes */}
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

            {/* Categories - now fully implemented */}
            <Route path="categories" element={<DashboardCategories />} />

            <Route
              path="inventory"
              element={
                <div className="p-8">
                  <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
                    Inventory — Coming Soon
                  </h1>
                </div>
              }
            />
            <Route
              path="discounts"
              element={
                <div className="p-8">
                  <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
                    Discounts — Coming Soon
                  </h1>
                </div>
              }
            />
            <Route
              path="enquiries"
              element={
                <div className="p-8">
                  <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
                    Enquiries — Coming Soon
                  </h1>
                </div>
              }
            />
            <Route
              path="settings"
              element={
                <div className="p-8">
                  <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
                    Settings — Coming Soon
                  </h1>
                </div>
              }
            />
            <Route
              path="users"
              element={
                <div className="p-8">
                  <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
                    Users — Coming Soon
                  </h1>
                </div>
              }
            />
            <Route
              path="audit-logs"
              element={
                <div className="p-8">
                  <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
                    Audit Logs — Coming Soon
                  </h1>
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;