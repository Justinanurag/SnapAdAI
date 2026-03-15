import { footerLinks } from "../assets/dummy-data";
import { motion } from "framer-motion";
import logo from "../assets/Svg3.png"

export default function Footer() {
  return (
    <motion.footer
      className="bg-white/6 border-t border-white/6 pt-10 text-gray-300"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-white/10">
          <div>
            <a
              href="/#"
              className="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
              <img
                src={logo}
                alt="SnapAd AI logo"
                className="h-8 w-auto"
              />
              <span>
                SnapAd <span className="text-blue-600">AI</span>
              </span>
            </a>

            <p className="max-w-[410px] mt-6 text-sm leading-relaxed">
              SnapAd AI helps you generate high-impact image and short video ads
              instantly using powerful AI—designed for creators, marketers, and
              fast-growing brands.
            </p>
          </div>

          <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-base text-white md:mb-5 mb-2">
                  {section.title}
                </h3>
                <ul className="text-sm space-y-1">
                  {section.links.map(
                    (link: { name: string; url: string }, i) => (
                      <li key={i}>
                        <a
                          href={link.url}
                          className="hover:text-white transition"
                        >
                          {link.name}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="py-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()}{" "}
            Justinanurag0.2
          . All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
