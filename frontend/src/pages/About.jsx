import React from "react";

const About = () => {
  return (
    <div className="min-h-screen" data-testid="about-page">
      <div className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
              About Us
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight text-[#2C2C2C]">
              GM_Bastralaya
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to GM_Bastralaya, your premier destination for exquisite
              fashion textiles and fabrics. We are dedicated to bringing you the
              finest selection of premium quality materials that seamlessly
              blend traditional craftsmanship with contemporary design.
            </p>

            <h2 className="font-heading text-2xl font-medium text-[#2C2C2C] mt-12 mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Founded with a passion for excellence, GM_Bastralaya has been
              crafting elegance in every thread. Our commitment to quality and
              customer satisfaction has made us a trusted name in the fashion
              textile industry.
            </p>

            <h2 className="font-heading text-2xl font-medium text-[#2C2C2C] mt-12 mb-4">
              What We Offer
            </h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-6">
              <li>Premium quality fabrics and textiles</li>
              <li>Wide range of designs and patterns</li>
              <li>Competitive pricing with attractive discounts</li>
              <li>Instant WhatsApp enquiry for all products</li>
              <li>Reliable customer service</li>
            </ul>

            <h2 className="font-heading text-2xl font-medium text-[#2C2C2C] mt-12 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Have questions? We're here to help! Reach out to us through
              WhatsApp for instant assistance with your enquiries.
            </p>
            <div className="bg-[#F2F0EB] p-6 rounded-md">
              <p className="text-gray-700">
                <strong>WhatsApp:</strong> +91 98765 43210
                <br />
                <strong>Email:</strong> info@gmbastralaya.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
