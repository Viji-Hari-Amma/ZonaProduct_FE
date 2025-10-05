import CompanyStatsCard from "./CompanyStatsCard";
import ContactInfoCard from "./ContactInfoCard";
import OwnerInfoCard from "./OwnerInfoCard";
import SocialMediaCard from "./SocialMediaCard";

const InfoCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <OwnerInfoCard />
      <CompanyStatsCard />
      <ContactInfoCard />
      <SocialMediaCard />
    </div>
  );
};

export default InfoCards;
