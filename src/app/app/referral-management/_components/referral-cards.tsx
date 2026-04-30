import {
  TotalPartnersIcon,
  UsersAddedViaReferralIcon,
  JobsPostedViaReferralIcon,
  RevenueViaPartnerIcon,
} from "./referral-icons";

type CardData = {
  id: number;
  title: string;
  value: string;
  icon: React.ComponentType;
};

type ReferralCardsProps = {
  cards: CardData[];
};

export const ReferralCards = ({ cards }: ReferralCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-[16px] bg-[rgba(0,88,100,0.09)] flex items-center justify-center flex-shrink-0">
                <IconComponent />
              </div>

              {/* Content */}
              <div>
                <p className="text-[13px] font-normal text-black leading-4 mb-2">
                  {card.title}
                </p>
                <h3 className="text-[26px] font-semibold text-black leading-8">
                  {card.value}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
