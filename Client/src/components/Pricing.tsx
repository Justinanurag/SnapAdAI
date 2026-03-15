import React from "react";
import { PricingTable } from "@clerk/react";

const Plans = () => {
  const [isYearly, setIsYearly] = React.useState(false);

  return (
    <section className="flex flex-col items-center py-24 px-6 text-white">

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">
        Create High-Converting Ads with AI
      </h1>

      <p className="text-gray-400 text-center max-w-xl mb-12 text-sm">
        Generate stunning image and video ads for your brand in seconds with
        SnapAdAI. Start free and upgrade as you grow.
      </p>

      {/* Billing Toggle */}
      <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 mb-16">
        
        <button
          onClick={() => setIsYearly(false)}
          className={`px-6 py-2 rounded-full text-sm transition ${
            !isYearly ? "bg-white/10 text-white" : "text-gray-400"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setIsYearly(true)}
          className={`px-6 py-2 rounded-full text-sm transition flex items-center gap-1 ${
            isYearly ? "bg-white/10 text-white" : "text-gray-400"
          }`}
        >
          Yearly
          <span className="text-xs text-indigo-400">15% off</span>
        </button>

      </div>

      {/* Pricing */}
      <div className="w-full max-w-5xl mx-auto flex justify-center">

        <PricingTable
          // billingCycle={isYearly ? "yearly" : "monthly"}
          appearance={{
            variables: {
              colorBackground: "transparent",
              colorPrimary: "#4f46e5",
            },
            elements: {
              pricingTableCard: "bg-white/5 border border-white/10 rounded-3xl backdrop-blur-lg",
              pricingTableCardHeader: "bg-white/10 border-b border-white/10",
              pricingTableCardBody: "text-white",
              pricingTableButton: "bg-indigo-600 hover:bg-indigo-700 text-white",
            },
          }}
        />

      </div>

    </section>
  );
};

export default Plans;