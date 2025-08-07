import React from 'react';
import ActiveUsersCard from '../../Components/AnalyticsCards/ActiveUsersCard';
import ApplicationCountCard from '../../Components/AnalyticsCards/ApplicationCountCard';
import ApplicationByLanguageCard from '../../Components/AnalyticsCards/ApplicationByLanguageCard';
import CvGeneratedCard from '../../Components/AnalyticsCards/CvGeneratedCard';
import TotalAccountsCard from '../../Components/AnalyticsCards/TotalAccountsCard ';
import ClGeneratedCard from '../../Components/AnalyticsCards/ClGeneratedCard';
import TopJobTitlesCard from '../../Components/AnalyticsCards/TopJobTitlesCard';
import TotalRevenueCard from '../../Components/AnalyticsCards/TotalRevenueCard';
import TotalSubscribersCard from '../../Components/AnalyticsCards/TotalSubscribersCard';
import UserProgressCard from '../../Components/AnalyticsCards/UserProgressCard';
import CoverLettersCard from '../../Components/AnalyticsCards/CoverLettersCard';
import InterviewsCard from '../../Components/AnalyticsCards/InterviewsCard';
import CvsGeneratedCard from '../../Components/AnalyticsCards/CvsGeneratedCard ';

const Dashboard = () => {
  return (
    <div className=" bg-gray-100 h-[1100px] relative ">
      {/* Active Users Card */}
      <div className="absolute top-6 left-10 w-[18%]">
        <ActiveUsersCard />
      </div>

      {/* Total Accounts Card */}
      <div className="absolute top-6 left-[330px] w-[18%]">
        <TotalAccountsCard />
      </div>

      {/* Application Count Card */}
      <div className="absolute top-6 left-[620px] w-[30%]">
        <ApplicationCountCard />
      </div>

      {/* Application By Language Card */}
      <div className="absolute top-6 left-[1100px]  w-[20%]">
        <ApplicationByLanguageCard />
      </div>

      {/* CV Generated Card */}
      <div className="absolute top-[180px] left-10 w-[18%]">
        <CvGeneratedCard />
      </div>

      <div className="absolute top-[460px] left-10 w-[38%]">
        <TopJobTitlesCard />
      </div>

      <div className="absolute top-[260px] left-[620px] w-[30%]">
        <TotalRevenueCard />
      </div>

      <div className="absolute top-[180px] left-[330px] w-[18%]">
        <ClGeneratedCard />
      </div>

      <div className="absolute top-[430px] left-[620px] w-[30%]">
        <TotalSubscribersCard />
      </div>

      <div className="absolute top-[430px] left-[620px] w-[30%]">
        <UserProgressCard />
      </div>

      <div className="absolute top-[780px] left-10 w-[46%]">
        <CoverLettersCard />
      </div>

      <div className="absolute top-[350px] left-[1100px] w-[30%]">
        <InterviewsCard />
      </div>

      <div className="absolute top-[780px] left-[750px] w-[46%]">
        <CvsGeneratedCard />
      </div>


    </div>
  );
};

export default Dashboard;
