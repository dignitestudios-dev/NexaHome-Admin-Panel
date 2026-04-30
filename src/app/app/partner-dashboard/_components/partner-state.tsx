import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { LayoutPanelLeft, UserRound } from "lucide-react";
import { HiUsers } from "react-icons/hi";

export function PartnerState() {
    const stats: { title: string; value: string; icon: any }[] = [
  { title: "Avg Response Time", value: "56,879", icon: HiUsers },
  { title: "Avg Responses Per Lead", value: "56,879", icon: LayoutPanelLeft },
  { title: "Total Leads Purchased", value: "56,879", icon: UserRound },
];

  return (
  <div className="flex flex-wrap gap-6 mb-12 ">
      {stats.map((item, i) => (
        <Card
          key={i}
          className="w-[270px] h-[100px] border-none shadow-none rounded-[24px] bg-white flex items-center"
        >
          <CardContent className="p-4 flex items-center gap-4 w-full">
            
            {/* Icon Container - Matching the soft rounded square look */}
            <div className="bg-[#EAF1F2] w-[68px] h-[68px] rounded-[24px] flex items-center justify-center shrink-0">
              <item.icon
                className="text-[#00515C]" 
                size={32}
                strokeWidth={2}
              />
            </div>

            {/* Text Section - Forced to single line */}
            <div className="flex flex-col justify-center min-w-0">
              <p className="text-[13px] font-medium text-[#333333] whitespace-nowrap overflow-hidden text-ellipsis">
                {item.title}
              </p>
              <h2 className="text-[28px] font-bold text-black leading-none whitespace-nowrap">
                {item.value}
              </h2>
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
}
