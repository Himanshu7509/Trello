import React from "react";
import inbox from "../../../../assets/inbox-slider.png";

export default function ProductivityPowerhouse() {
  return (
    <section className="bg-white py-16 px-6 md:px-24">
      <div className="max-w-5xl text-left">
        <p className="text-xl font-bold text-gray-700 uppercase tracking-wider mb-2">
          TRELLO 101
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#091e42] mb-4">
          Your productivity powerhouse
        </h2>
        <p className="text-[#091e42] mb-8 text-2xl">
          Stay organized and efficient with Inbox, Boards, and Planner. Every
          to-do, idea, or responsibility—no matter how small—finds its place,
          keeping you at the top of your game.
        </p>
      </div>

      <div className="max-w-7xl flex flex-col-reverse lg:flex-row items-center gap-10">
        <div className="lg:w-1/3">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-500">
              <h3 className="font-bold text-2xl text-[#172b4d] mb-1">Inbox</h3>
              <p className="text-[#172b4d] text-xl">
                When it’s on your mind, it goes in your Inbox. Capture your
                to-dos from anywhere, anytime.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-2xl text-[#172b4d] mb-1">Boards</h3>
              <p className="text-[#172b4d] text-xl">
                Your to-do list may be long, but it can be manageable! Keep tabs
                on everything from “to-dos to tackle” to “mission accomplished!”
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-1 py-1 rounded-full uppercase tracking-wide">
                Coming soon
              </span>
              <h3 className="font-bold text-2xl text-[#172b4d] mb-1">
                Planner
              </h3>

              <p className="text-[#172b4d] text-xl">
                Drag, drop, get it done. Snap your top tasks into your calendar
                and make time for what truly matters.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3 flex justify-center">
          <img
            src={inbox}
            alt="Productivity example"
            className="w-full max-w-full"
          />
        </div>
      </div>
    </section>
  );
}
