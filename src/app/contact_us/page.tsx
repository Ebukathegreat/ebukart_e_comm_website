"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-4  flex items-center justify-center md:pb-5 ">
      <div className="max-w-2xl  w-full bg-white shadow-xl md:rounded-2xl overflow-hidden animate-fadeIn">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-8 text-white text-center">
          <h1 className="text-3xl font-bold">We’d Love to Hear From You</h1>
          <p className="mt-2 text-lg">
            Questions, feedback, or just saying hello — our team is here for
            you!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Contact Form */}
          <form
            action="https://getform.io/f/bpjnjyxb" // Replace with your Getform endpoint
            method="POST"
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                placeholder="What’s this about?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="text-pink-500" size={24} />
              <span className="text-gray-700">support@notarealemail.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="text-pink-500" size={24} />
              <span className="text-gray-700">+234 800 000 0000</span>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="text-pink-500" size={24} />
              <span className="text-gray-700">
                123 Market Street, Lagos, Nigeria
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Follow Us</h3>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="text-pink-500 hover:text-pink-600">
                  <i className="fab fa-instagram text-2xl"></i>
                </a>
                <a href="#" className="text-pink-500 hover:text-pink-600">
                  <i className="fab fa-facebook text-2xl"></i>
                </a>
                <a href="#" className="text-pink-500 hover:text-pink-600">
                  <i className="fab fa-twitter text-2xl"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Business Hours</h3>
              <p className="text-gray-600">
                We're here for you{" "}
                <span className="text-[20px] mt-2 text-pink-500 font-bold animate-pulse drop-shadow-[0_0_6px_rgba(255,105,180,0.8)]">
                  24/7
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
