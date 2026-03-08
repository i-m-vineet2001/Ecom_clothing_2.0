// import React, { useEffect, useState } from "react";
// import { Package, Tag, Warehouse, MessageSquare, Eye } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import api from "../../lib/api.jsx";

// const DashboardOverview = () => {
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     activeDiscounts: 0,
//     totalEnquiries: 0,
//     lowStockProducts: 0,
//     visibleProducts:0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   // const fetchStats = async () => {
//   //   try {
//   //     const [products, enquiries] = await Promise.all([
//   //       api.get("/products?limit=1000"),
//   //       api.get("/enquiries"),
//   //     ]);

//   //     const activeDiscounts = products.data.filter(
//   //       (p) => p.discount && p.discount.active,
//   //     ).length;
//   //     const lowStock = products.data.filter(
//   //       (p) => p.inventory && p.inventory.quantity < 10,
//   //     ).length;

//   //     setStats({
//   //       totalProducts: products.data.length,
//   //       activeDiscounts,
//   //       totalEnquiries: enquiries.data.length,
//   //       lowStockProducts: lowStock,
//   //     });
//   //   } catch (error) {
//   //     console.error("Failed to fetch stats:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   // Change this section in your DashboardOverview.jsx
//   const fetchStats = async () => {
//     try {
//       const [products, enquiries] = await Promise.all([
//         // FIX: Changed limit to 500 to satisfy backend validation
//         api.get("/products?limit=500&include_inactive=true"),
//         api.get("/enquiries"),
//       ]);

//       const activeDiscounts = products.data.filter(
//         (p) => p.discount && p.discount.active,
//       ).length;
//       const lowStock = products.data.filter(
//         (p) => p.inventory && p.inventory.quantity < 10,
//       ).length;

//       const visibleProducts =
//         products?.data.filter((p) => p.active === true).length || 0;

//       setStats({
//         totalProducts: products.data.length,
//         activeDiscounts,
//         totalEnquiries: enquiries.data.length,
//         lowStockProducts: lowStock,
//         visibleProducts,
//       });
//     } catch (error) {
//       // This was showing the 422 error in your console
//       console.error("Failed to fetch stats:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     {
//       title: "Total Products",
//       value: stats.totalProducts,
//       icon: Package,
//       color: "text-blue-600",
//     },
//     {
//       title: "Active Discounts",
//       value: stats.activeDiscounts,
//       icon: Tag,
//       color: "text-green-600",
//     },
//     {
//       title: "Total Enquiries",
//       value: stats.totalEnquiries,
//       icon: MessageSquare,
//       color: "text-purple-600",
//     },
//     {
//       title: "Low Stock Items",
//       value: stats.lowStockProducts,
//       icon: Warehouse,
//       color: "text-red-600",
//     },
//     {
//       title: "Visible Products",
//       value: stats.visibleProducts,
//       icon: Eye,
//       color: "text-green-600",
//     },
//   ];

//   return (
//     <div className="p-8" data-testid="dashboard-overview">
//       <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C] mb-8">
//         Dashboard Overview
//       </h1>

//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//           {statCards.map((stat) => {
//             const Icon = stat.icon;
//             return (
//               <Card key={stat.title} className="border-[#F2F0EB]">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium text-gray-600">
//                     {stat.title}
//                   </CardTitle>
//                   <Icon className={`w-5 h-5 ${stat.color}`} />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-[#2C2C2C]">
//                     {stat.value}
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       <div className="mt-12">
//         <Card className="border-[#F2F0EB]">
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <a
//                 href="/dashboard/products"
//                 className="p-4 border border-[#F2F0EB] rounded-md hover:border-[#C5A059] transition-colors"
//               >
//                 <Package className="w-6 h-6 mb-2 text-[#C5A059]" />
//                 <h3 className="font-medium mb-1">Manage Products</h3>
//                 <p className="text-sm text-gray-500">
//                   Add, edit, or remove products
//                 </p>
//               </a>
//               <a
//                 href="/dashboard/discounts"
//                 className="p-4 border border-[#F2F0EB] rounded-md hover:border-[#C5A059] transition-colors"
//               >
//                 <Tag className="w-6 h-6 mb-2 text-[#C5A059]" />
//                 <h3 className="font-medium mb-1">Create Discounts</h3>
//                 <p className="text-sm text-gray-500">
//                   Set up product discounts
//                 </p>
//               </a>
//               <a
//                 href="/dashboard/enquiries"
//                 className="p-4 border border-[#F2F0EB] rounded-md hover:border-[#C5A059] transition-colors"
//               >
//                 <MessageSquare className="w-6 h-6 mb-2 text-[#C5A059]" />
//                 <h3 className="font-medium mb-1">View Enquiries</h3>
//                 <p className="text-sm text-gray-500">
//                   Check customer enquiries
//                 </p>
//               </a>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default DashboardOverview;

import React, { useEffect, useState } from "react";
import { Package, Tag, Warehouse, MessageSquare, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "../../lib/api.jsx";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeDiscounts: 0,
    totalEnquiries: 0,
    lowStockProducts: 0,
    visibleProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  // const fetchStats = async () => {
  //   try {
  //     const [products, enquiries] = await Promise.all([
  //       api.get("/products?limit=1000"),
  //       api.get("/enquiries"),
  //     ]);

  //     const activeDiscounts = products.data.filter(
  //       (p) => p.discount && p.discount.active,
  //     ).length;
  //     const lowStock = products.data.filter(
  //       (p) => p.inventory && p.inventory.quantity < 10,
  //     ).length;

  //     setStats({
  //       totalProducts: products.data.length,
  //       activeDiscounts,
  //       totalEnquiries: enquiries.data.length,
  //       lowStockProducts: lowStock,
  //     });
  //   } catch (error) {
  //     console.error("Failed to fetch stats:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Change this section in your DashboardOverview.jsx
  const fetchStats = async () => {
    try {
      const [products, enquiries] = await Promise.all([
        // FIX: Changed limit to 500 to satisfy backend validation
        api.get("/products?limit=500&include_inactive=true"),
        api.get("/enquiries"),
      ]);

      const activeDiscounts = products.data.filter(
        (p) => p.discount && p.discount.active,
      ).length;
      const lowStock = products.data.filter(
        (p) => p.inventory && p.inventory.quantity < 10,
      ).length;

      const visibleProducts =
        products?.data.filter((p) => p.active === true).length || 0;

      setStats({
        totalProducts: products.data.length,
        activeDiscounts,
        totalEnquiries: enquiries.data.length,
        lowStockProducts: lowStock,
        visibleProducts,
      });
    } catch (error) {
      // This was showing the 422 error in your console
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Active Discounts",
      value: stats.activeDiscounts,
      icon: Tag,
      color: "text-green-600",
    },
    {
      title: "Total Enquiries",
      value: stats.totalEnquiries,
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockProducts,
      icon: Warehouse,
      color: "text-red-600",
    },
    {
      title: "Visible Products",
      value: stats.visibleProducts,
      icon: Eye,
      color: "text-green-600",
    },
  ];

  return (
    <div className="p-4 sm:p-8" data-testid="dashboard-overview">
      <h1 className="font-heading text-2xl sm:text-4xl font-semibold text-[#2C2C2C] mb-6 sm:mb-8">
        Dashboard Overview
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-[#F2F0EB]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-[#2C2C2C]">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-8 sm:mt-12">
        <Card className="border-[#F2F0EB]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <a
                href="/dashboard/products"
                className="p-4 border border-[#F2F0EB] rounded-md hover:border-[#C5A059] transition-colors"
              >
                <Package className="w-6 h-6 mb-2 text-[#C5A059]" />
                <h3 className="font-medium mb-1">Manage Products</h3>
                <p className="text-sm text-gray-500">
                  Add, edit, or remove products
                </p>
              </a>
              <a
                href="/dashboard/discounts"
                className="p-4 border border-[#F2F0EB] rounded-md hover:border-[#C5A059] transition-colors"
              >
                <Tag className="w-6 h-6 mb-2 text-[#C5A059]" />
                <h3 className="font-medium mb-1">Create Discounts</h3>
                <p className="text-sm text-gray-500">
                  Set up product discounts
                </p>
              </a>
              <a
                href="/dashboard/enquiries"
                className="p-4 border border-[#F2F0EB] rounded-md hover:border-[#C5A059] transition-colors"
              >
                <MessageSquare className="w-6 h-6 mb-2 text-[#C5A059]" />
                <h3 className="font-medium mb-1">View Enquiries</h3>
                <p className="text-sm text-gray-500">
                  Check customer enquiries
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;