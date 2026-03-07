
// import React, { useState } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
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

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Where to go back after login
//   const from = location.state?.from || "/";
//   const enquireProductId = location.state?.enquireProductId || null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const user = await login(email, password);
//       toast.success("Login successful!");
//       if (user.role === "admin" || user.role === "shopowner") {
//         navigate("/dashboard");
//       } else {
//         // Return to previous page and auto-trigger enquiry if applicable
//         navigate(from, {
//           replace: true,
//           state: { autoEnquire: enquireProductId },
//         });
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.detail || "Login failed. Check your credentials.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex" data-testid="login-page">
//       {/* Left — decorative image */}
//       <div className="hidden md:block md:w-1/2 relative">
//         <img
//           src="https://images.unsplash.com/photo-1756267318202-afebdffc107a?w=1200"
//           alt="Fashion boutique"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/20" />
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
//               Welcome Back
//             </h1>
//             <p className="text-gray-500 text-sm">
//               Sign in to access your dashboard
//             </p>
//           </div>

//           <Card className="border-[#E8E5E0] shadow-sm">
//             <CardHeader className="pb-4">
//               <CardTitle className="font-heading text-lg">Sign In</CardTitle>
//               <CardDescription>
//                 Enter your credentials to continue
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {/* Banner shown when redirected from enquiry */}
//               {enquireProductId && (
//                 <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
//                   <span>🔒</span>
//                   <span>
//                     Please sign in to enquire about this product on WhatsApp
//                   </span>
//                 </div>
//               )}

//               <form
//                 onSubmit={handleSubmit}
//                 className="space-y-5"
//                 autoComplete="on"
//               >
//                 <div className="space-y-1.5">
//                   <Label htmlFor="login-email">Email address</Label>
//                   <Input
//                     id="login-email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="you@example.com"
//                     required
//                     className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
//                     data-testid="email-input"
//                   />
//                 </div>

//                 <div className="space-y-1.5">
//                   <Label htmlFor="login-password">Password</Label>
//                   <Input
//                     id="login-password"
//                     name="password"
//                     type="password"
//                     autoComplete="current-password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="••••••••"
//                     required
//                     className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
//                     data-testid="password-input"
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-all duration-300 rounded-none uppercase text-xs tracking-widest font-bold py-3"
//                   data-testid="login-button"
//                 >
//                   {loading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Signing in...
//                     </span>
//                   ) : (
//                     "Sign In"
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

//               {/* Link to signup — passes redirect state forward */}
//               <p className="text-center text-sm text-gray-500">
//                 Don't have an account?{" "}
//                 <Link
//                   to="/signup"
//                   state={{ from, enquireProductId }}
//                   className="text-[#C5A059] hover:underline font-medium"
//                 >
//                   Create one
//                 </Link>
//               </p>

//               {/* Role hint */}
//               <div className="mt-6 p-4 bg-[#F9F8F5] border border-[#F2F0EB] rounded-md">
//                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
//                   Access Roles
//                 </p>
//                 <p className="text-xs text-gray-500 leading-5">
//                   🔑 <strong>Admin / Shopowner</strong> — full dashboard access
//                   <br />
//                   👁 <strong>Viewer</strong> — browse store only
//                   <br />
//                   <span className="text-gray-400">
//                     Contact your admin to change your role.
//                   </span>
//                 </p>
//               </div>
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

// export default Login;


import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";
  const enquireProductId = location.state?.enquireProductId || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success("Login successful!");
      if (user.role === "admin" || user.role === "shopowner") {
        navigate("/dashboard");
      } else {
        navigate(from, {
          replace: true,
          state: { autoEnquire: enquireProductId },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white" data-testid="login-page">
      {/* ─── LEFT SIDE: EDITORIAL IMAGE ─── */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[#2C2C2C]">
        <img
          src="https://images.unsplash.com/photo-1756267318202-afebdffc107a?w=1200"
          alt="Boutique"
          className="w-full h-full object-cover opacity-80 animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 to-transparent" />
        <div className="absolute bottom-16 left-16">
          <p className="font-heading text-6xl text-white font-light tracking-tighter">
            GM_ <br />
            <span className="font-serif italic text-[#C5A059] ml-12">Bastralaya</span>
          </p>
          <div className="h-[1px] w-24 bg-[#C5A059] mt-6 mb-4" />
          <p className="text-[10px] text-white/60 tracking-[0.4em] uppercase font-bold">
            Elegance Refined
          </p>
        </div>
      </div>

      {/* ─── RIGHT SIDE: MINIMALIST FORM ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 md:px-24 bg-[#FCFAF8]">
        <div className="w-full max-w-sm">
          {/* Header */}
          <header className="mb-12 text-center lg:text-left">
            <span className="text-[10px] tracking-[0.3em] font-bold text-[#C5A059] uppercase mb-4 block">
              Member Access
            </span>
            <h1 className="font-heading text-4xl font-light text-[#2C2C2C] mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase">
              Enter your credentials below
            </p>
          </header>

          {/* Enquiry Lock Banner */}
          {enquireProductId && (
            <div className="mb-8 p-4 bg-white border border-[#F2F0EB] shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="bg-[#C5A059]/10 p-2">
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                Sign in to continue your enquiry
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <Label 
                  htmlFor="login-email" 
                  className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2 block group-focus-within:text-[#C5A059] transition-colors"
                >
                  Email Address
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 border-b border-gray-200 bg-transparent rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#C5A059] transition-all placeholder:text-gray-200"
                  placeholder="name@example.com"
                />
              </div>

              <div className="relative group">
                <Label 
                  htmlFor="login-password" 
                  className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2 block group-focus-within:text-[#C5A059] transition-colors"
                >
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-0 border-b border-gray-200 bg-transparent rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#C5A059] transition-all placeholder:text-gray-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#2C2C2C] hover:bg-[#C5A059] text-white rounded-none uppercase text-xs tracking-[0.2em] font-bold transition-all duration-500 shadow-xl"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Authenticate"
              )}
            </Button>
          </form>

          {/* Footer Actions */}
          <footer className="mt-12 space-y-6 text-center lg:text-left">
            <p className="text-[11px] tracking-wide text-gray-400">
              New to the archive?{" "}
              <Link
                to="/signup"
                state={{ from, enquireProductId }}
                className="text-[#C5A059] font-bold hover:text-[#2C2C2C] transition-colors uppercase ml-1"
              >
                Create Account
              </Link>
            </p>
            
            <div className="pt-6 border-t border-gray-100">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C5A059] transition-all"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Home
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;