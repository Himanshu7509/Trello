import React from "react";
import Autodev from "../../../../assets/Autodev.svg";
import Integration from "../../../../assets/Integration.svg";
import Project from "../../../../assets/Project_management.svg";

const features = [
  {
    icon: Integration,
    title: "Integrations",
    description:
      "Connect the apps your team already uses into your Trello workflow or add a Power-Up to fine-tune your specific needs.",
    button: "Browse Integrations",
  },
  {
    icon: Autodev,
    title: "Butler Automation",
    description:
      "No-code automation is built into every Trello board. Focus on the work that matters most and let the robots do the rest.",
    button: "Get to know Automation",
  },
  {
    icon: Project,
    title: "Card mirroring",
    description:
      "View your to-dos from different boards in more than one place. Mirror a card to keep track of work wherever you need it!",
    button: null,
  },
];

export default function DoMoreWithTrello() {
  return (
    <section className="min-h-screen py-24 px-4 bg-white flex flex-col justify-center">
      <div className="max-w-6xl mb-12 px-24 text-center md:text-left">
        <h4 className="text-lg md:text-xl font-semibold text-[#091e42] uppercase tracking-widest mb-4">
          Work Smarter
        </h4>
        <h2 className="text-3xl md:text-5xl font-bold text-[#091e42] mb-6">
          Do more with Trello
        </h2>
        <p className="text-base md:text-xl text-[#42526e] max-w-3xl mx-auto md:mx-0">
          Customize the way you organize with easy integrations, automation, and
          mirroring of your to-dos across multiple locations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#f9fafc] rounded-xl shadow-sm p-8 md:p-12 flex flex-col justify-between h-full"
          >
            <img
              src={feature.icon}
              alt={`${feature.title} icon`}
              className="w-32 h-32 mb-6"
            />
            <h3 className="text-2xl md:text-3xl font-bold text-[#091e42] mb-3">
              {feature.title}
            </h3>
            <p className="text-lg text-[#42526e] mb-6">{feature.description}</p>
            {feature.button && (
              <button className="text-lg font-medium text-[#0052cc] border border-[#0052cc] px-4 py-3 rounded hover:bg-[#e6f0ff] transition w-fit">
                {feature.button}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
