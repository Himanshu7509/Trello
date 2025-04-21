import React from "react";
import {
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import logos from "../../../../assets/logos-horizontal-visa-coinbase-john-deere-zoom-grand-hyatt-fender.svg";
import { Link } from "react-router-dom";

export default function TrelloFooterSection() {
  return (
    <div className="bg-white">
      <div className="py-10 text-center">
        <p className="text-4xl text-gray-700 mb-6">
          Join a community of millions of users globally who are using Trello to
          get more done.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 px-4">
          <img src={logos} className="h-16 md:h-20 object-contain" />
        </div>
      </div>

      <div className="bg-gray-100 py-24 px-4 text-center">
        <h2 className="text-2xl md:text-5xl font-semibold text-[#091e42] mb-10">
          Get started with Trello today
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
          <input
            type="email"
            placeholder="Email"
            className="px-6 py-4 rounded-md border w-full sm:w-auto flex-grow"
          />
          <Link to="/signup">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-4 rounded-md">
            Sign up – it’s free!
          </button>
          </Link>
        </div>
      </div>

      <footer className="bg-[#1D2B44] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex flex-col">
              <span className="text-md text-gray-300 font-semibold">
                ATLASSIAN
              </span>
              <span className="text-3xl font-bold text-white">Trello</span>
            </div>
            <a href="#" className="text-md hover:underline text-white mt-2">
              Log In
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-2xl text-white mb-2">
              About Trello
            </h3>
            <p className="text-md text-gray-300">What’s behind the boards.</p>
          </div>

          <div>
            <h3 className="font-semibold text-2xl text-white mb-2">Jobs</h3>
            <p className="text-md text-gray-300">
              Learn about open roles on the Trello team.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-2xl text-white mb-2">Apps</h3>
            <p className="text-md text-gray-300">
              Download the Trello App for your Desktop or Mobile devices.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-2xl text-white mb-2">
              Contact us
            </h3>
            <p className="text-md text-gray-300">
              Need anything? Get in touch and we can help.
            </p>
          </div>
        </div>

        <hr className="border-[#2c3e55] mx-6" />

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="text-md">Čeština</span>
              <span>▼</span>
            </div>
            <div className="hidden md:flex gap-4 flex-wrap">
              <a href="#" className="hover:underline text-lg">
                Notice at Collection
              </a>
              <a href="#" className="hover:underline text-lg">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline text-lg">
                Terms
              </a>
              <a href="#" className="hover:underline text-lg">
                Copyright © 2024 Atlassian
              </a>
            </div>
          </div>

          <div className="flex gap-4 text-white">
            <a href="#">
              <Instagram className="h-5 w-5 hover:text-gray-300" />
            </a>
            <a href="#">
              <Facebook className="h-5 w-5 hover:text-gray-300" />
            </a>
            <a href="#">
              <Linkedin className="h-5 w-5 hover:text-gray-300" />
            </a>
            <a href="#">
              <Twitter className="h-5 w-5 hover:text-gray-300" />
            </a>
            <a href="#">
              <Youtube className="h-5 w-5 hover:text-gray-300" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
