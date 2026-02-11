import React from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

// SVG import
import heroIllustration from "../assets/undraw_ai-research-assistant_cxx0.svg";

const HeroSection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-[#f6f3ff]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="flex flex-col gap-6">
          <span className="w-fit px-4 py-2 rounded-full bg-gray-100 text-[#f83002] font-medium">
            Welcome to Job Recommendation And Skill Assessment Portal
          </span>

          <h1 className="text-5xl font-bold leading-tight">
            Search, Apply & Enhance your Skills <br />
            and Get your <span className="text-[#6A38C2]">Dream Job</span>
          </h1>

          <p className="text-gray-600 max-w-md">
          Stop searching, start landing. From skill-testing to interview prep, our AI analyzes your resume to match you with opportunities you’ll actually love.
          </p>

          {/* SEARCH BAR */}
          <div className="flex w-full md:w-[85%] shadow-lg border border-gray-200 pl-4 rounded-full items-center gap-3 bg-white">
            <input
              type="text"
              placeholder="Frontend Intern · Java Backend · Data Analyst"
              className="outline-none border-none w-full py-3 text-sm"
            />
            <Button className="rounded-full bg-[#6A38C2] hover:bg-[#5b2fb3] px-6">
              <Search className="h-5 w-5 text-white" />
            </Button>
          </div>

          {/* QUICK ACTIONS */}
          <div className="flex flex-wrap gap-4 mt-4">
            <Button className="bg-[#6A38C2] hover:bg-[#5b2fb3]">
              Take Skill Test
            </Button>

            <Button
              variant="outline"
              className="border-[#6A38C2] text-[#6A38C2]"
            >
              AI Interview Prep
            </Button>

             <Button className="bg-[#6A38C2] hover:bg-[#5b2fb3]">
             Apply Recommended Jobs
            </Button>
          </div>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="flex justify-center">
          <img
            src={heroIllustration}
            alt="AI career assistant illustration"
            className="w-[90%] max-w-md animate-float"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
