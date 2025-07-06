import React, { useContext } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Context } from '../context/Context';

dayjs.extend(relativeTime);

const ProjectOverview = () => {


  const {
    project,
    surveyStatus
  } = useContext(Context);

  const {
    Created_On,
    Last_Modified,
    Status,
    Total_Points = 0,
 
  } = project || {};


  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg flex flex-col gap-4">
      <h2 className="text-base md:text-lg font-semibold border-b pb-2">
        Project Overview
      </h2>

      <OverviewRow label="Created On" value={dayjs(Created_On).format('MMM D, YYYY')} />
      <OverviewRow label="Last Modified" value={dayjs(Last_Modified).fromNow()} />
      <OverviewRow
        label="Status"
        value={surveyStatus}
        customClasses="bg-blue-600 text-white"
      />
      <OverviewRow label="Number of Points" value={Total_Points} />

      
    </div>
  );
};

const OverviewRow = ({ label, value, customClasses = '' }) => (
  <div className="flex justify-between items-center">
    <span className="font-semibold text-sm md:text-base">{label}</span>
    <span
      className={`px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center
        bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100 ${customClasses}`}
    >
      {value}
    </span>
  </div>
);

export default ProjectOverview;
