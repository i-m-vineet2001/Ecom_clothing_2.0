
// // import React, { useState } from "react";
// // import { useNavigate, useLocation, Link } from "react-router-dom";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "../components/ui/card";
// // import { toast } from "sonner";
// // import api from "../lib/api.jsx";

// // const Signup = () => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     confirmPassword: "",
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // Preserve redirect context from login page
// //   const from = location.state?.from || "/";
// //   const enquireProductId = location.state?.enquireProductId || null;

// //   const handleChange = (field) => (e) =>
// //     setFormData((prev) => ({ ...prev, [field]: e.target.value }));

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (formData.password !== formData.confirmPassword) {
// //       toast.error("Passwords do not match");
// //       return;
// //     }
// //     if (formData.password.length < 6) {
// //       toast.error("Password must be at least 6 characters");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       await api.post("/auth/register", {
// //         name: formData.name,
// //         email: formData.email,
// //         password: formData.password,
// //         role: "viewer",
// //       });
// //       toast.success("Account created! Please sign in.");
// //       // Pass redirect context to login so they land back on product page
// //       navigate("/login", { state: { from, enquireProductId } });
// //     } catch (error) {
// //       toast.error(
// //         error.response?.data?.detail ||
// //           "Registration failed. Please try again.",
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex" data-testid="signup-page">
// //       {/* Left — decorative image */}
// //       <div className="hidden md:block md:w-1/2 relative">
// //         <img
// //           src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200"
// //           alt="Fashion"
// //           className="w-full h-full object-cover"
// //         />
// //         <div className="absolute inset-0 bg-black/30" />
// //         <div className="absolute bottom-10 left-10 text-white">
// //           <p className="font-heading text-4xl font-semibold">
// //             GM_<span className="text-[#C5A059]">Bastralaya</span>
// //           </p>
// //           <p className="text-sm mt-2 opacity-80 tracking-widest uppercase">
// //             Crafting elegance in every thread
// //           </p>
// //         </div>
// //       </div>

// //       {/* Right — form */}
// //       <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-[#F9F8F5]">
// //         <div className="w-full max-w-md">
// //           {/* Mobile logo */}
// //           <div className="md:hidden text-center mb-8">
// //             <p className="font-heading text-3xl font-semibold text-[#2C2C2C]">
// //               GM_<span className="text-[#C5A059]">Bastralaya</span>
// //             </p>
// //           </div>

// //           <div className="text-center mb-8">
// //             <h1 className="font-heading text-3xl font-semibold text-[#2C2C2C] mb-2">
// //               Create Account
// //             </h1>
// //             <p className="text-gray-500 text-sm">Join GM_Bastralaya today</p>
// //           </div>

// //           <Card className="border-[#E8E5E0] shadow-sm">
// //             <CardHeader className="pb-4">
// //               <CardTitle className="font-heading text-lg">Sign Up</CardTitle>
// //               <CardDescription>
// //                 Fill in your details to get started
// //               </CardDescription>
// //             </CardHeader>
// //             <CardContent>
// //               {/* Banner shown when redirected from enquiry */}
// //               {enquireProductId && (
// //                 <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
// //                   <span>🔒</span>
// //                   <span>
// //                     Create an account to enquire about this product on WhatsApp
// //                   </span>
// //                 </div>
// //               )}

// //               <form
// //                 onSubmit={handleSubmit}
// //                 className="space-y-4"
// //                 autoComplete="on"
// //               >
// //                 {/* Full name */}
// //                 <div className="space-y-1.5">
// //                   <Label htmlFor="signup-name">Full name</Label>
// //                   <Input
// //                     id="signup-name"
// //                     name="name"
// //                     type="text"
// //                     autoComplete="name"
// //                     value={formData.name}
// //                     onChange={handleChange("name")}
// //                     placeholder="Your full name"
// //                     required
// //                     className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
// //                     data-testid="name-input"
// //                   />
// //                 </div>

// //                 {/* Email */}
// //                 <div className="space-y-1.5">
// //                   <Label htmlFor="signup-email">Email address</Label>
// //                   <Input
// //                     id="signup-email"
// //                     name="email"
// //                     type="email"
// //                     autoComplete="email"
// //                     value={formData.email}
// //                     onChange={handleChange("email")}
// //                     placeholder="you@example.com"
// //                     required
// //                     className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
// //                     data-testid="email-input"
// //                   />
// //                 </div>

// //                 {/* Password */}
// //                 <div className="space-y-1.5">
// //                   <Label htmlFor="signup-password">Password</Label>
// //                   <Input
// //                     id="signup-password"
// //                     name="password"
// //                     type="password"
// //                     autoComplete="new-password"
// //                     value={formData.password}
// //                     onChange={handleChange("password")}
// //                     placeholder="At least 6 characters"
// //                     required
// //                     minLength={6}
// //                     className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
// //                     data-testid="password-input"
// //                   />
// //                 </div>

// //                 {/* Confirm password */}
// //                 <div className="space-y-1.5">
// //                   <Label htmlFor="signup-confirm">Confirm password</Label>
// //                   <Input
// //                     id="signup-confirm"
// //                     name="confirm-password"
// //                     type="password"
// //                     autoComplete="new-password"
// //                     value={formData.confirmPassword}
// //                     onChange={handleChange("confirmPassword")}
// //                     placeholder="Repeat your password"
// //                     required
// //                     minLength={6}
// //                     className={`bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md ${
// //                       formData.confirmPassword &&
// //                       formData.password !== formData.confirmPassword
// //                         ? "border-red-400"
// //                         : ""
// //                     }`}
// //                     data-testid="confirm-password-input"
// //                   />
// //                   {formData.confirmPassword &&
// //                     formData.password !== formData.confirmPassword && (
// //                       <p className="text-xs text-red-500 mt-1">
// //                         Passwords do not match
// //                       </p>
// //                     )}
// //                 </div>

// //                 <Button
// //                   type="submit"
// //                   disabled={
// //                     loading ||
// //                     (formData.confirmPassword &&
// //                       formData.password !== formData.confirmPassword)
// //                   }
// //                   className="w-full bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-all duration-300 rounded-none uppercase text-xs tracking-widest font-bold py-3 mt-2"
// //                   data-testid="signup-button"
// //                 >
// //                   {loading ? (
// //                     <span className="flex items-center justify-center gap-2">
// //                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                       Creating account...
// //                     </span>
// //                   ) : (
// //                     "Create Account"
// //                   )}
// //                 </Button>
// //               </form>

// //               {/* Divider */}
// //               <div className="relative my-5">
// //                 <div className="absolute inset-0 flex items-center">
// //                   <div className="w-full border-t border-[#E8E5E0]" />
// //                 </div>
// //                 <div className="relative flex justify-center text-xs uppercase">
// //                   <span className="bg-white px-2 text-gray-400 tracking-widest">
// //                     or
// //                   </span>
// //                 </div>
// //               </div>

// //               <p className="text-center text-sm text-gray-500">
// //                 Already have an account?{" "}
// //                 <Link
// //                   to="/login"
// //                   state={{ from, enquireProductId }}
// //                   className="text-[#C5A059] hover:underline font-medium"
// //                 >
// //                   Sign in
// //                 </Link>
// //               </p>
// //             </CardContent>
// //           </Card>

// //           <div className="text-center mt-6">
// //             <Link
// //               to="/"
// //               className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
// //             >
// //               ← Back to Home
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Signup;




// import React, { useState } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { toast } from "sonner";
// import api from "../lib/api.jsx";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Preserve redirect context from login page
//   const from = location.state?.from || "/";
//   const enquireProductId = location.state?.enquireProductId || null;

//   const handleChange = (field) => (e) =>
//     setFormData((prev) => ({ ...prev, [field]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post("/auth/register", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: "viewer",
//       });
//       toast.success("Account created! Please sign in.");
//       // Pass redirect context to login so they land back on product page
//       navigate("/login", { state: { from, enquireProductId } });
//     } catch (error) {
//       toast.error(
//         error.response?.data?.detail ||
//           "Registration failed. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex" data-testid="signup-page">
//       {/* Left — decorative image */}
//       <div className="hidden md:block md:w-1/2 relative">
//         <img
//           src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200"
//           alt="Fashion"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/30" />
//         <div className="absolute bottom-10 left-10 text-white">
//           <p className="font-heading text-4xl font-semibold">
//             GM_<span className="text-[#C5A059]">Bastralaya</span>
//           </p>
//           <p className="text-sm mt-2 opacity-80 tracking-widest uppercase">
//             Crafting elegance in every thread
//           </p>
//         </div>
//       </div>

//       {/* Right — form */}
//       <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-[#F9F8F5]">
//         <div className="w-full max-w-md">
//           {/* Mobile logo */}
//           <div className="md:hidden text-center mb-8">
//             <p className="font-heading text-3xl font-semibold text-[#2C2C2C]">
//               GM_<span className="text-[#C5A059]">Bastralaya</span>
//             </p>
//           </div>

//           <div className="text-center mb-8">
//             <h1 className="font-heading text-3xl font-semibold text-[#2C2C2C] mb-2">
//               Create Account
//             </h1>
//             <p className="text-gray-500 text-sm">Join GM_Bastralaya today</p>
//           </div>

//           <Card className="border-[#E8E5E0] shadow-sm">
//             <CardHeader className="pb-4">
//               <CardTitle className="font-heading text-lg">Sign Up</CardTitle>
//               <CardDescription>
//                 Fill in your details to get started
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {/* Banner shown when redirected from enquiry */}
//               {enquireProductId && (
//                 <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
//                   <span>🔒</span>
//                   <span>
//                     Create an account to enquire about this product on WhatsApp
//                   </span>
//                 </div>
//               )}

//               <form
//                 onSubmit={handleSubmit}
//                 className="space-y-4"
//                 autoComplete="on"
//               >
//                 {/* Full name */}
//                 <div className="space-y-1.5">
//                   <Label htmlFor="signup-name">Full name</Label>
//                   <Input
//                     id="signup-name"
//                     name="name"
//                     type="text"
//                     autoComplete="name"
//                     value={formData.name}
//                     onChange={handleChange("name")}
//                     placeholder="Your full name"
//                     required
//                     className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
//                     data-testid="name-input"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div className="space-y-1.5">
//                   <Label htmlFor="signup-email">Email address</Label>
//                   <Input
//                     id="signup-email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     value={formData.email}
//                     onChange={handleChange("email")}
//                     placeholder="you@example.com"
//                     required
//                     className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
//                     data-testid="email-input"
//                   />
//                 </div>

//                 {/* Password */}
//                 <div className="space-y-1.5">
//                   <Label htmlFor="signup-password">Password</Label>
//                   <Input
//                     id="signup-password"
//                     name="password"
//                     type="password"
//                     autoComplete="new-password"
//                     value={formData.password}
//                     onChange={handleChange("password")}
//                     placeholder="At least 6 characters"
//                     required
//                     minLength={6}
//                     className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
//                     data-testid="password-input"
//                   />
//                 </div>

//                 {/* Confirm password */}
//                 <div className="space-y-1.5">
//                   <Label htmlFor="signup-confirm">Confirm password</Label>
//                   <Input
//                     id="signup-confirm"
//                     name="confirm-password"
//                     type="password"
//                     autoComplete="new-password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange("confirmPassword")}
//                     placeholder="Repeat your password"
//                     required
//                     minLength={6}
//                     className={`bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md ${
//                       formData.confirmPassword &&
//                       formData.password !== formData.confirmPassword
//                         ? "border-red-400"
//                         : ""
//                     }`}
//                     data-testid="confirm-password-input"
//                   />
//                   {formData.confirmPassword &&
//                     formData.password !== formData.confirmPassword && (
//                       <p className="text-xs text-red-500 mt-1">
//                         Passwords do not match
//                       </p>
//                     )}
//                 </div>

//                 <Button
//                   type="submit"
//                   disabled={
//                     loading ||
//                     (formData.confirmPassword &&
//                       formData.password !== formData.confirmPassword)
//                   }
//                   className="w-full bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-all duration-300 rounded-none uppercase text-xs tracking-widest font-bold py-3 mt-2"
//                   data-testid="signup-button"
//                 >
//                   {loading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Creating account...
//                     </span>
//                   ) : (
//                     "Create Account"
//                   )}
//                 </Button>
//               </form>

//               {/* Divider */}
//               <div className="relative my-5">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-[#E8E5E0]" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-white px-2 text-gray-400 tracking-widest">
//                     or
//                   </span>
//                 </div>
//               </div>

//               <p className="text-center text-sm text-gray-500">
//                 Already have an account?{" "}
//                 <Link
//                   to="/login"
//                   state={{ from, enquireProductId }}
//                   className="text-[#C5A059] hover:underline font-medium"
//                 >
//                   Sign in
//                 </Link>
//               </p>
//             </CardContent>
//           </Card>

//           <div className="text-center mt-6">
//             <Link
//               to="/"
//               className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
//             >
//               ← Back to Home
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "../lib/api.jsx";
import { Lock, ArrowLeft, UserPlus } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";
  const enquireProductId = location.state?.enquireProductId || null;

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "viewer",
      });
      toast.success("Account created! Please sign in.");
      navigate("/login", { state: { from, enquireProductId } });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = !formData.confirmPassword || formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex bg-white" data-testid="signup-page">
      {/* ─── LEFT SIDE: EDITORIAL IMAGE ─── */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[#2C2C2C]">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200"
          alt="Fashion Editorial"
          className="w-full h-full object-cover opacity-70 animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2C2C2C]/20 to-[#2C2C2C]/90" />
        <div className="absolute bottom-16 left-16">
          <p className="font-heading text-6xl text-white font-light tracking-tighter">
            Join the <br />
            <span className="font-serif italic text-[#C5A059] ml-12">Collective</span>
          </p>
          <div className="h-[1px] w-24 bg-[#C5A059] mt-6 mb-4" />
          <p className="text-[10px] text-white/60 tracking-[0.4em] uppercase font-bold">
            GM_Bastralaya Signature
          </p>
        </div>
      </div>

      {/* ─── RIGHT SIDE: MINIMALIST FORM ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 md:px-24 bg-[#FCFAF8]">
        <div className="w-full max-w-sm">
          {/* Header */}
          <header className="mb-10 text-center lg:text-left">
            <span className="text-[10px] tracking-[0.3em] font-bold text-[#C5A059] uppercase mb-4 block">
              New Account
            </span>
            <h1 className="font-heading text-4xl font-light text-[#2C2C2C] mb-2 tracking-tight">
              Create Profile
            </h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase">
              Begin your curated journey
            </p>
          </header>

          {/* Enquiry Lock Banner */}
          {enquireProductId && (
            <div className="mb-8 p-4 bg-white border border-[#F2F0EB] shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="bg-[#C5A059]/10 p-2">
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 leading-relaxed">
                Register to enquire about this piece
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="relative group">
              <Label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1 block group-focus-within:text-[#C5A059] transition-colors">
                Full Name
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                required
                className="border-0 border-b border-gray-200 bg-transparent rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#C5A059] transition-all placeholder:text-gray-200"
                placeholder="ELARA VANCE"
              />
            </div>

            {/* Email Address */}
            <div className="relative group">
              <Label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1 block group-focus-within:text-[#C5A059] transition-colors">
                Email Address
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                required
                className="border-0 border-b border-gray-200 bg-transparent rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#C5A059] transition-all placeholder:text-gray-200"
                placeholder="NAME@EXAMPLE.COM"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1 block group-focus-within:text-[#C5A059] transition-colors">
                Password
              </Label>
              <Input
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                required
                minLength={6}
                className="border-0 border-b border-gray-200 bg-transparent rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#C5A059] transition-all placeholder:text-gray-200"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <Label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1 block group-focus-within:text-[#C5A059] transition-colors">
                Confirm Password
              </Label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                required
                className={`border-0 border-b bg-transparent rounded-none px-0 py-2 focus-visible:ring-0 transition-all placeholder:text-gray-200 ${!passwordsMatch ? 'border-red-400' : 'border-gray-200 focus-visible:border-[#C5A059]'}`}
                placeholder="••••••••"
              />
              {!passwordsMatch && (
                <p className="absolute -bottom-5 left-0 text-[9px] uppercase tracking-tighter text-red-500 font-bold">
                  Credentials do not match
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full h-14 bg-[#2C2C2C] hover:bg-[#C5A059] text-white rounded-none uppercase text-xs tracking-[0.2em] font-bold transition-all duration-500 shadow-xl mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Profile"
              )}
            </Button>
          </form>

          {/* Footer Actions */}
          <footer className="mt-12 space-y-6 text-center lg:text-left">
            <p className="text-[11px] tracking-wide text-gray-400">
              Already have a profile?{" "}
              <Link
                to="/login"
                state={{ from, enquireProductId }}
                className="text-[#C5A059] font-bold hover:text-[#2C2C2C] transition-colors uppercase ml-1"
              >
                Sign In
              </Link>
            </p>
            
            <div className="pt-6 border-t border-gray-100">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C5A059] transition-all"
              >
                <ArrowLeft className="w-3 h-3" /> Return to Home
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Signup;