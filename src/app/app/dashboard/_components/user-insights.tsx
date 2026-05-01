import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const insightsData = [
  { label: "Active Users", value: 68 },
  { label: "Repeat Homeowners", value: 68 },
  { label: "Completed Jobs", value: 68 },
];

const Donut = ({
  value,
  color = "#065662",
  bgColor = "#EFEFEF",
}: {
  value: number;
  color?: string;
  bgColor?: string;
}) => {
  const data = [{ value }];

  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={0} // Based on image, ends look flat or slightly rounded
              fill={color}
              background={{ fill: bgColor }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const UserInsights: React.FC = () => {
  return (
    // Change the outer Card to use flex-row and ensure it doesn't collapse
    <Card className="rounded-[40px] border-none shadow-sm h-[400px] flex flex-row overflow-hidden w-full bg-white">
      {/* LEFT SECTION - Use flex-grow so it takes remaining space */}
      <CardContent className="flex-1 p-8 flex flex-col justify-between min-w-0">
        <h2 className="text-[16px] font-bold">User Insights</h2>

        <div className="flex items-center gap-4 w-full">
          {insightsData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col min-w-0">
              {/* Donut */}
              <div className="flex justify-center py-6">
                <Donut value={item.value} />
              </div>

              {/* Label */}
              <div className="bg-[#F0F5F6] rounded-[24px] p-4 text-center">
                <p className="text-[12px] font-semibold text-gray-600 mb-1 truncate">
                  {item.label}
                </p>
                <p className="text-2xl font-black text-[#065662]">
                  {item.value}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* RIGHT SECTION - The Rating Sidebar */}
      {/* We set a specific flex-basis so it always has room to show up */}
      <div className="flex-none w-[240px] bg-[#065662] p-5 m-2 rounded-[35px] flex flex-col items-center justify-between">
        {/* Rating Donut */}
        <div className="mt-6">
          <Donut value={25} color="#94B2B6" bgColor="white" />
        </div>

        {/* Bottom Rating Box */}
        <div className="w-full bg-white/10 backdrop-blur-md rounded-[28px] py-6 flex flex-col items-center border border-white/10">
          <p className="text-xs text-white/80 mb-2">Average Rating</p>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
            <span className="text-3xl font-bold text-white italic">4.7</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserInsights;
