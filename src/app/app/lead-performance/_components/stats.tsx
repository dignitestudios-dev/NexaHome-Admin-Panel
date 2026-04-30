import React from "react";
import { Clock, LayoutPanelLeft, UserRound } from "lucide-react";

type StatItem = {
  title: string;
  value: string | number;
  icon: React.ElementType;
};

const stats: StatItem[] = [
  { title: "Avg Response Time", value: "56,879", icon: Clock },
  { title: "Avg Responses Per Lead", value: "56,879", icon: LayoutPanelLeft },
  { title: "Total Leads Purchased", value: "56,879", icon: UserRound },
];

const Stats = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {stats.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="w-[270px] h-[100px] border-none shadow-none rounded-[24px] bg-white flex items-center"
          >
            <div className="p-4 flex items-center gap-4 w-full">
              
              {/* Icon */}
              <div className="bg-[#EAF1F2] w-[68px] h-[68px] rounded-[24px] flex items-center justify-center shrink-0">
                <Icon
                  className="text-[#00515C] fill-[#00515C]/10"
                  size={32}
                  strokeWidth={2}
                />
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center min-w-0">
                <p className="text-[13px] font-medium text-[#333333] whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.title}
                </p>
                <h2 className="text-[28px] font-bold text-black leading-none whitespace-nowrap">
                  {item.value}
                </h2>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;