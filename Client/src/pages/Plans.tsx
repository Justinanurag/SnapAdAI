import React from "react";
import { CheckCircle2 } from "lucide-react";

const Plans = () => {
  const [isYearly, setIsYearly] = React.useState(false);

  const pricingData = [
    {
      name: "Free",
      pricing: 0,
      features: [
        "10 AI ad generations / month",
        "Image ads only",
        "720p export",
        "Basic templates",
        "Community support",
        "SpanAdAI watermark",
      ],
    },
    {
      name: "Pro",
      pricing: 19,
      mostPopular: true,
      features: [
        "200 AI ad generations / month",
        "Image + Video ads",
        "1080p export",
        "Premium ad templates",
        "No watermark",
        "Priority email support",
        "Ad performance insights",
      ],
    },
    {
      name: "Enterprise",
      pricing: 49,
      features: [
        "Unlimited AI ad generations",
        "Image + Video + Carousel ads",
        "4K export",
        "Custom brand templates",
        "Team collaboration",
        "API access",
        "Priority 24/7 support",
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center py-20 px-4 text-white">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-3">
        Create High-Converting Ads with AI
      </h1>

      <p className="text-gray-400 text-center mb-10 text-sm">
        Generate stunning image and video ads for your brand in seconds with
        SpanAdAI. Start free and upgrade as you grow.
      </p>

      {/* Toggle */}
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
          className={`px-6 py-2 rounded-full text-sm transition ${
            isYearly ? "bg-white/10 text-white" : "text-gray-400"
          }`}
        >
          Yearly
          <span className="ml-1 text-xs text-indigo-400">15% off</span>
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {pricingData.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-6 border transition
            ${
              plan.mostPopular
                ? "bg-white/10 border-indigo-500/50 shadow-lg"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            {/* Popular Badge */}
            {plan.mostPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-indigo-500 px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            {/* Plan Name */}
            <h3 className="text-sm text-gray-400 mb-4">{plan.name}</h3>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-3xl font-semibold">
                $
                {isYearly
                  ? plan.pricing - Math.round(plan.pricing * 0.15)
                  : plan.pricing}
              </span>
              <span className="text-gray-400 text-sm">/ month</span>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >
                  <CheckCircle2 size={16} className="text-indigo-400" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              className={`w-full py-3 rounded-lg text-sm font-medium transition
              ${
                plan.mostPopular
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
