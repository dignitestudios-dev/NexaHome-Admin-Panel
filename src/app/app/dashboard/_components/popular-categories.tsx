import React from "react";

type Category = {
  name: string;
  value: string;
  width: string;
  color?: string;
  gradient?: string;
};

const categories: Category[] = [
  {
    name: "Window Cleaning",
    value: "10,000",
    width: "100%",
    color: "#004D4D",
  },
  {
    name: "Power Washing",
    value: "8,000",
    width: "80%",
    color: "#005864",
  },
  {
    name: "Soft Washing",
    value: "6,000",
    width: "65%",
    gradient:
      "bg-gradient-to-r from-[#0FA3A3]/20 via-[#0FA3A3]/60 to-[#0FA3A3]",
  },
  {
    name: "Glass Repair",
    value: "4,000",
    width: "40%",
    color: "#0FA3A3",
  },
  {
    name: "Roof Cleaning",
    value: "10,000",
    width: "100%",
    color: "#004D4D",
  },
  {
    name: "Gutter Cleaning",
    value: "10,000",
    width: "100%",
    color: "#004D4D",
  },
];

const PopularCategories: React.FC = () => {
  return (
    <div className="rounded-[40px] border-none shadow-sm bg-white p-8">
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">
        Popular Categories
      </h2>

      <div className="space-y-6">
        {categories.map((cat, i) => {
          const barStyle = cat.gradient
            ? {}
            : { backgroundColor: cat.color };

          return (
            <div key={i} className="space-y-2">
              
              {/* Header */}
              <div className="flex justify-between items-center font-bold">
                <div className="flex items-center gap-3 text-[#1A1A1A]">
                  <span className="w-6 h-6 bg-[#004D4D] text-white text-[10px] flex items-center justify-center rounded-md font-black">
                    {i + 1}
                  </span>
                  <span className="text-sm">{cat.name}</span>
                </div>

                <span className="text-sm text-gray-500">
                  {cat.value}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#E6EEEE] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${cat.gradient || ""}`}
                  style={{
                    width: cat.width,
                    ...barStyle,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;