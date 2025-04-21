import React from "react";
import email from "../../../../assets/email-todos.png";
import slack from "../../../../assets/slack-to-inbox.png";

export default function MessageToAction() {
  return (
    <section className="bg-[#0052cc] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center mb-12 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          From message to action
        </h2>
        <p className="text-base md:text-xl text-blue-100">
          Quickly turn communication from your favorite apps into to-dos,
          keeping all your discussions and tasks organized in one place.
        </p>
      </div>

      <div className="space-y-12 max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 w-full flex justify-center">
            <img
              src={email}
              alt="Email to Trello Inbox"
              className="w-full rounded"
            />
          </div>

          <div className="lg:w-1/2 p-4 w-full text-[#091e42]">
            <div className="flex items-center gap-2 mb-12">
              <img src="/email-icon.png" alt="email icon" className="w-5 h-5" />
              <h3 className="text-xl font-bold">Email Magic</h3>
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase mb-2 inline-block">
              Coming soon
            </span>
            <p className="text-md md:text-lg text-[#091e42]">
              Easily turn your emails into to-dos! Just forward them to your
              Trello Inbox, and they'll be transformed by Atlassian Intelligence
              (AI) into organized to-dos with all the links you need.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col lg:flex-row-reverse items-center gap-8">
          <div className="lg:w-1/2 w-full flex justify-center">
            <img src={slack} alt="Slack to Trello Inbox" className="w-full" />
          </div>

          <div className="lg:w-1/2 p-4 w-full text-[#091e42]">
            <div className="flex items-center gap-2 mb-12">
              <img src="/slack-icon.png" alt="slack icon" className="w-5 h-5" />
              <h3 className="text-xl font-bold">Slack Sorcery</h3>
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full uppercase mb-2 inline-block">
              Coming soon
            </span>
            <p className="text-md md:text-lg text-[#091e42]">
              Need to follow up on a Slack message? Send it directly to your
              Trello board! Slack's interface lets you save messages that appear
              in your Trello Inbox with AI-generated summaries and links.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
