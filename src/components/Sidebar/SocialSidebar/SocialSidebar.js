import React from "react";
import {
  FaWhatsapp,
  FaLinkedin,
  FaTelegram,
  FaInstagram,
} from "react-icons/fa";

const socials = [
  {
    name: "WhatsApp",
    icon: FaWhatsapp,
    link: "https://wa.me/+918012099050",
    color: "bg-green-500",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    link: "https://www.linkedin.com/in/hari-haran-8281351a8/",
    color: "bg-blue-600",
  },
  {
    name: "Telegram",
    icon: FaTelegram,
    link: "https://t.me/+918012099050",
    color: "bg-sky-500",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    link: "https://www.instagram.com/heart_stoler_hari/",
    color: "bg-pink-500",
  },
];

const SocialSidebar = () => {
  return (
    <div className="fixed top-1/3 right-0 z-50 flex flex-col space-y-3 items-end">
      {socials.map((social, index) => {
        const Icon = social.icon;
        return (
          <a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex items-center w-[35px] md:w-12 hover:w-40 transition-all duration-300 ease-in-out text-white px-2 py-2 rounded-l-lg ${social.color}`}
          >
            <span className="mr-2">
              {/* Icon size: 20 below md, 24 above md */}
              <span className="block md:hidden">
                <Icon size={20} />
              </span>
              <span className="hidden md:block">
                <Icon size={24} />
              </span>
            </span>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300">
              {social.name}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default SocialSidebar;
