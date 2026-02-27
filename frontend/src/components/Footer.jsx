// import React from "react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-[#2C2C2C] text-white">
//       <div className="px-6 md:px-12 lg:px-24 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//           <div>
//             <h3 className="font-heading text-2xl mb-4">
//               GM_<span className="text-[#C5A059]">Bastralaya</span>
//             </h3>
//             <p className="text-sm text-gray-400 leading-relaxed">
//               Crafting elegance in every thread. Your destination for premium
//               fashion textiles.
//             </p>
//           </div>

//           <div>
//             <h4 className="font-bold text-sm uppercase tracking-widest mb-4">
//               Quick Links
//             </h4>
//             <div className="flex flex-col gap-2">
//               <Link
//                 to="/catalog"
//                 className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
//               >
//                 Catalog
//               </Link>
//               <Link
//                 to="/categories"
//                 className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
//               >
//                 Categories
//               </Link>
//               <Link
//                 to="/about"
//                 className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors"
//               >
//                 About Us
//               </Link>
//             </div>
//           </div>

//           <div>
//             <h4 className="font-bold text-sm uppercase tracking-widest mb-4">
//               Contact
//             </h4>
//             <p className="text-sm text-gray-400 leading-relaxed">
//               WhatsApp: +91 98765 43210
//               <br />
//               Email: info@gmbastralaya.com
//             </p>
//           </div>
//         </div>

//         <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
//           <p>
//             &copy; {new Date().getFullYear()} GM_Bastralaya. All rights
//             reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2C2C2C] text-white">
      <div className="px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-heading text-2xl mb-4">
              GM_<span className="text-[#C5A059]">Bastralaya</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed font-body">
              Crafting elegance in every thread. Your destination for premium
              fashion textiles.
            </p>
          </div>

          <div>
            <h4 className="font-body font-bold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/catalog"
                className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors font-body no-underline"
              >
                Catalog
              </Link>
              <Link
                to="/categories"
                className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors font-body no-underline"
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="text-sm text-gray-400 hover:text-[#C5A059] transition-colors font-body no-underline"
              >
                About Us
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-body font-bold text-sm uppercase tracking-widest mb-4">
              Contact
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed font-body">
              WhatsApp: +91 98765 43210
              <br />
              Email: info@gmbastralaya.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400 font-body">
          <p>
            &copy; {new Date().getFullYear()} GM_Bastralaya. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;