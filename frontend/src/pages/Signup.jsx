// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
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
// import api from "../lib/api";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

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
//         role: "viewer", // new public signups are viewers
//       });
//       toast.success("Account created! Please sign in.");
//       navigate("/login");
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "sonner";
import api from "../lib/api";

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

  // Preserve redirect context from login page
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
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
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
      // Pass redirect context to login so they land back on product page
      navigate("/login", { state: { from, enquireProductId } });
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="signup-page">
      {/* Left — decorative image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-10 left-10 text-white">
          <p className="font-heading text-4xl font-semibold">
            GM_<span className="text-[#C5A059]">Bastralaya</span>
          </p>
          <p className="text-sm mt-2 opacity-80 tracking-widest uppercase">
            Crafting elegance in every thread
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-[#F9F8F5]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <p className="font-heading text-3xl font-semibold text-[#2C2C2C]">
              GM_<span className="text-[#C5A059]">Bastralaya</span>
            </p>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-semibold text-[#2C2C2C] mb-2">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">Join GM_Bastralaya today</p>
          </div>

          <Card className="border-[#E8E5E0] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-lg">Sign Up</CardTitle>
              <CardDescription>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Banner shown when redirected from enquiry */}
              {enquireProductId && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
                  <span>🔒</span>
                  <span>
                    Create an account to enquire about this product on WhatsApp
                  </span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                autoComplete="on"
              >
                {/* Full name */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name">Full name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="Your full name"
                    required
                    className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
                    data-testid="name-input"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Email address</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    placeholder="you@example.com"
                    required
                    className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
                    data-testid="email-input"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md"
                    data-testid="password-input"
                  />
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-confirm">Confirm password</Label>
                  <Input
                    id="signup-confirm"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    placeholder="Repeat your password"
                    required
                    minLength={6}
                    className={`bg-white border-[#E8E5E0] focus:border-[#C5A059] rounded-md ${
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? "border-red-400"
                        : ""
                    }`}
                    data-testid="confirm-password-input"
                  />
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>

                <Button
                  type="submit"
                  disabled={
                    loading ||
                    (formData.confirmPassword &&
                      formData.password !== formData.confirmPassword)
                  }
                  className="w-full bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-all duration-300 rounded-none uppercase text-xs tracking-widest font-bold py-3 mt-2"
                  data-testid="signup-button"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8E5E0]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400 tracking-widest">
                    or
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  state={{ from, enquireProductId }}
                  className="text-[#C5A059] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;