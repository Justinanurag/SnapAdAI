import { UploadIcon, VideoIcon, ZapIcon,SparklesIcon } from "lucide-react";

export const featuresData = [
  {
    icon: <ZapIcon className="w-6 h-6" />,
    title: "One-Click AI Creation",
    desc: "Turn simple prompts into scroll-stopping video ads and image creatives in seconds using intelligent AI automation.",
  },
  {
    icon: <UploadIcon className="w-6 h-6" />,
    title: "Brand-Aware Design Engine",
    desc: "Automatically generate ads tailored to your niche, audience, and brand style with smart AI-driven personalization.",
  },
  {
    icon: <VideoIcon className="w-6 h-6" />,
    title: "Performance-Ready Exports",
    desc: "Export high-resolution ads optimized for Instagram Reels, YouTube Shorts, Facebook, and other digital platforms.",
  },
//   {
//   icon: <SparklesIcon className="w-6 h-6" />,
//   title: "AI Script & Caption Generator",
//   desc: "Generate engaging ad scripts, hooks, and captions designed to maximize reach, engagement, and conversions."
// }
];
export const plansData = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    desc: "Perfect for creators getting started.",
    credits: "20 AI credits / month",
    features: [
      "20 AI image generations",
      "5 short video ads",
      "Basic templates",
      "720p export quality",
      "Watermarked exports",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    desc: "For serious creators & marketers.",
    credits: "300 AI credits / month",
    features: [
      "300 AI image generations",
      "50 AI short video ads",
      "Premium templates",
      "1080p HD export",
      "No watermark",
      "AI script & caption generator",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: "$79",
    desc: "Built for agencies & growing brands.",
    credits: "Unlimited AI credits",
    features: [
      "Unlimited image generations",
      "Unlimited short video ads",
      "4K export quality",
      "Advanced brand customization",
      "Team collaboration",
      "API access",
      "Dedicated support",
    ],
  },
];

export const faqData = [
  {
    question: "What is SnapAd AI?",
    answer:
      "SnapAd AI is an AI-powered platform that generates high-converting image ads and short-form video ads in seconds. Simply enter your idea or product details, and our AI creates ready-to-use marketing creatives."
  },
  {
    question: "Do I need design or editing skills?",
    answer:
      "No. SnapAd AI is built for creators, marketers, and businesses of all skill levels. The platform handles design, visuals, captions, and formatting automatically."
  },
  {
    question: "Which platforms are exports optimized for?",
    answer:
      "You can export ads optimized for Instagram Reels, YouTube Shorts, Facebook, and other social media platforms. Higher plans include HD and 4K export options."
  },
  {
    question: "Are the generated ads royalty-free?",
    answer:
      "Yes. All generated images and videos can be used for commercial purposes based on your subscription plan. You retain full rights to your exported content."
  },
  {
    question: "How does the credit system work?",
    answer:
      "Each AI generation (image or video) consumes credits. Free users receive limited monthly credits, while Pro and Scale plans include higher or unlimited usage."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard."
  }
];

export const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "Home", url: "#" },
      { name: "Services", url: "#" },
      { name: "Work", url: "#" },
      { name: "Contact", url: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", url: "#" },
      { name: "Terms of Service", url: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { name: "Twitter", url: "#" },
      { name: "LinkedIn", url: "#" },
      { name: "GitHub", url: "#" },
    ],
  },
];
