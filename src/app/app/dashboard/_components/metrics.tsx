import React from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Briefcase,
  UserStar,
  User,
} from "lucide-react";

type StatItem = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
};

const stats: StatItem[] = [
  {
    title: "Total Users",
    value: "12,430",
    icon: User,
    trend: "8% increase this month",
  },
  {
    title: "Total Experts",
    value: "32,000",
    icon: UserStar,
    trend: "5% increase this month",
  },
  {
    title: "Total Jobs Posted",
    value: "1,240",
    icon: Briefcase,
    trend: "10% increase this month",
  },
  {
    title: "Total Revenue",
    value: "56,876",
    icon: TrendingUp,
    trend: "12% increase this month",
  },
];

const Metrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white"
          >
            <div className="p-0">
              {/* Top Section */}
              <div className="p-4 flex items-center gap-5">
                <div className="bg-[#E6EEEE] p-5 rounded-2xl">
                  <Icon className="w-8 h-8 text-[#004D4D]" strokeWidth={2.5} />
                </div>

                <div>
                  <p className="text-[13px] font-medium ">{item.title}</p>
                  <h2 className="text-[26px] font-semibold tracking-tight">
                    {item.value}
                  </h2>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="bg-[#005864] py-3 px-8 flex items-center gap-2 text-white font-light text-[13px]">
                <TrendingUp className="w-5 h-5" />
                {item.trend}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Metrics;
