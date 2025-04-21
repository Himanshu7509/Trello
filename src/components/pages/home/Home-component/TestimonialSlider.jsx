import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ptclogo from "../../../../assets/ptc-logo.svg";
import women from "../../../../assets/WomenWhoCode_logo.svg";

const testimonials = [
  {
    text: "We used Trello to provide clarity on steps, requirements, and procedures. This was exceptional when communicating with teams that had deep cultural and language differences.",
    author: "Jefferson Scomacao",
    role: "Development Manager at IKEA/PTC",
    companyLogo: ptclogo,
    storyLink: "#",
    stat: "74% of customers say Trello has improved communication with their co-workers and teams.",
    source: "Trello TechValidate Survey",
    sourceLink: "#",
  },
  {
    text: "[Trello is] great for simplifying complex processes. As a manager, I can chunk  [processes] down into bite-sized pieces for my team and then delegate that out, but still keep a bird's-eye view.",
    author: "Joey Rosenberg",
    role: "Global Leadership Director at Women Who Code",
    companyLogo: women,
    storyLink: "#",
    stat: "75% of organizations report that Trello delivers value to their business within 30 days.",
    source: "Trello TechValidate Survey",
    sourceLink: "#",
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const testimonial = testimonials[current];

  return (
    <div className=" bg-white py-10 px-4 md:px-8 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-end gap-4 mt-6 mb-4">
          <button
            onClick={prevSlide}
            className="rounded-full border p-2 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="rounded-full border p-2 hover:bg-gray-100 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row shadow-lg rounded-2xl overflow-hidden">
          <div className="w-full md:w-2/3 p-10 md:p-16 flex flex-col justify-between bg-white">
            <div>
              <p className="text-2xl md:text-4xl text-[#091e42] mb-16">
                {testimonial.text}
              </p>
              <div className="border-t w-32 border-[#091e42] mb-12"></div>
              <p className="font-semibold text-2xl text-[#091e42]">
                {testimonial.author}
              </p>
              <p className="text-lg text-[#5e6c84]">{testimonial.role}</p>
            </div>

            <div className="flex items-center justify-between mt-6">
              <img
                src={testimonial.companyLogo}
                alt="Company Logo"
                className="h-8 w-auto object-contain"
              />
              <a
                href={testimonial.storyLink}
                className="text-lg text-[#0052cc] underline"
              >
                Read the story
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/3 bg-[#0052cc] text-white flex flex-col justify-between items-start p-6 md:p-10">
            <p className="text-xl md:text-4xl font-semibold">
              {testimonial.stat}
            </p>
            <a
              href={testimonial.sourceLink}
              className="text-lg underline text-white"
            >
              {testimonial.source}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
