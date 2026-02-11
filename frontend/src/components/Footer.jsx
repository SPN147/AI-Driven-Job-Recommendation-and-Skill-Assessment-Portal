import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-xl font-bold text-[#f83002]">JobHunt</h2>
          <p className="mt-3 text-sm text-gray-600">
            India's No.1 platform to connect job seekers and recruiters. Find
            your dream job with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-[#f83002]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="hover:text-[#f83002]">
                Jobs
              </Link>
            </li>
            <li>
              <Link to="/companies" className="hover:text-[#f83002]">
                Companies
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#f83002]">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/contact" className="hover:text-[#f83002]">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-[#f83002]">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-[#f83002]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#f83002]">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Get in Touch</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center gap-2">
              <Mail size={18} /> support@jobhunt.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} /> Hyderabad, India
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="p-2 bg-white rounded-full shadow hover:text-[#f83002]"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-white rounded-full shadow hover:text-[#f83002]"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-white rounded-full shadow hover:text-[#f83002]"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-white rounded-full shadow hover:text-[#f83002]"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4">
        <p className="text-center text-sm text-gray-600">
          © {new Date().getFullYear()} JobHunt — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
