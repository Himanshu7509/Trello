import React from "react";
import img from "../../../../assets/homeimg.png";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <>
      <div className="bg-[#deebff] w-full text-center py-6 px-4 text-sm text-[#172b4d]">
        <p className="text-lg font-semibold leading-relaxed">
          Accelerate your teams' work with Atlassian Intelligence (AI) features
          🤖 now available for all Premium and Enterprise!{" "}
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            Learn more.
          </a>
        </p>
      </div>

      <div className="bg-[#f4f5f7] min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 py-10">
        <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#091e42] leading-tight">
            Capture, organize, and <br /> tackle your to-dos from anywhere.
          </h1>
          <p className="text-[#091e42] mt-6 text-xl max-w-md mx-auto lg:mx-0">
            Escape the clutter and chaos—unleash your productivity with Trello.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 max-w-md mx-auto lg:mx-0">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-4 rounded w-full sm:w-auto flex-1 border border-gray-300 focus:outline-none"
            />
            <Link to="/signup">
            <button className="bg-[#0052cce3] text-white px-6 py-4 rounded hover:bg-[#0747a6] w-full sm:w-auto">
              Sign up - it’s free!
            </button>
            </Link>
          </div>

          <div className="mt-8 text-[#0052cc] flex items-center justify-center lg:justify-start gap-1">
            <a href="#" className="underline text-xl">
              Watch video
            </a>
            <span>▶️</span>
          </div>
        </div>

        <div className="lg:w-1/2 relative flex justify-center items-center">
          <img src={img} alt="Phone UI" className="w-full h-full" />
        </div>
      </div>
    </>
  );
}
