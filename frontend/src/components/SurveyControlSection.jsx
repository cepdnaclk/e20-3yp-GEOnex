import React, { useState , useContext} from 'react';
import { Context } from '../context/Context';
import { Play, Pause, CheckCircle, RotateCcw } from 'lucide-react';

export default function SurveyControlSection() {
  const { navigate, project, getProjectsData,userData, surveyStatus, setSurveyStatus, updateProjectStatus } = useContext(Context);



  const handlePause = () => {
    setSurveyStatus('Paused');
    updateProjectStatus(project._id, 'Paused');

  };

  const handleResume = () => {
    setSurveyStatus('Active');
    updateProjectStatus(project._id, 'Active');
  };

  const handleComplete = () => {
    setSurveyStatus('Completed');
    updateProjectStatus(project._id, 'Completed');
  };

  const handleReset = () => {
    setSurveyStatus('Active');
    updateProjectStatus(project._id, 'Active');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg flex flex-col gap-2 h-max">
      <h2 className="text-base md:text-lg font-semibold border-b pb-2">Survey Status</h2>
      
      {/* Surveying Animation - Central and Large */}
      <div className="mb-1 flex flex-col items-center py-6">
        {/* <div className="flex gap-2 mb-4">
          <div className={`w-5 h-5 rounded-full transition-all duration-700 ${
            surveyStatus === 'active' ? 'bg-blue-950 animate-pulse' : 'bg-gray-300'
          }`}></div>
          <div className={`w-5 h-5 rounded-full transition-all duration-700 ${
            surveyStatus === 'active' ? 'bg-blue-950 animate-pulse' : 'bg-gray-300'
          }`} style={{ animationDelay: '0.2s' }}></div>
          <div className={`w-5 h-5 rounded-full transition-all duration-700 ${
            surveyStatus === 'active' ? 'bg-blue-950 animate-pulse' : 'bg-gray-300'
          }`} style={{ animationDelay: '0.4s' }}></div>
          <div className={`w-5 h-5 rounded-full transition-all duration-700 ${
            surveyStatus === 'active' ? 'bg-blue-950 animate-pulse' : 'bg-gray-300'
          }`} style={{ animationDelay: '0.6s' }}></div>
          <div className={`w-5 h-5 rounded-full transition-all duration-700 ${
            surveyStatus === 'active' ? 'bg-blue-950 animate-pulse' : 'bg-gray-300'
          }`} style={{ animationDelay: '0.8s' }}></div>
          <div className={`w-5 h-5 rounded-full transition-all duration-700 ${
            surveyStatus === 'active' ? 'bg-blue-950 animate-pulse' : 'bg-gray-300'
          }`} style={{ animationDelay: '1.0s' }}></div>
          <div className={`w-5 h-5 rounded-full transition-all duration-700 ${
            surveyStatus === 'active' ? 'bg-blue-950 animate-pulse' : 'bg-gray-300'
          }`} style={{ animationDelay: '1.2s' }}></div>
          <div className={`w-5 h-5 rounded-full transition-all duration-700 ${
            surveyStatus === 'active' ? 'bg-blue-950 animate-pulse' : 'bg-gray-300'
          }`} style={{ animationDelay: '1.4s' }}></div>
        </div> */}

        <div className="flex gap-2 mb-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 0.2}s` }}
              className={`w-5 h-5 rounded-full transition-all duration-700 ${
                surveyStatus === "Active"
                  ? "bg-blue-950 dark:bg-indigo-500 animate-pulse"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        
        <span className="text-xl font-semibold text-gray-700 dark:text-gray-100 text-center mb-1">
          {surveyStatus === 'Active' ? 'Surveying in Progress...' : 
           surveyStatus === 'Paused' ? 'Survey Paused' : 
           'Survey Completed'}
        </span>
        <div className="text-sm text-gray-500 dark:text-gray-300 text-center">
          {surveyStatus === 'Active' ? 'Collecting geodata from field sensors' : 
           surveyStatus === 'Paused' ? 'Field operations temporarily suspended' : 
           'All survey points successfully recorded'}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            surveyStatus === 'Active' ? 'bg-green-500' : 
            surveyStatus === 'Paused' ? 'bg-yellow-500' : 
            'bg-blue-500'
          }`}></div>
          <span className="text-sm capitalize font-medium">
            {surveyStatus === 'Active' ? 'In Progress' : 
             surveyStatus === 'Paused' ? 'Paused' : 
             'Completed'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col gap-2">
        {surveyStatus === 'Active' && (
          <button
            onClick={handlePause}
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
          >
            <Pause size={16} />
            Pause Survey
          </button>
        )}

        {surveyStatus === 'Paused' && (
          <button
            onClick={handleResume}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
          >
            <Play size={16} />
            Resume Survey
          </button>
        )}

        {surveyStatus !== 'Completed' && (
          <button
            onClick={handleComplete}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
          >
            <CheckCircle size={16} />
            Mark as Complete
          </button>
        )}

        {surveyStatus === 'Completed' && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 bg-green-100 text-green-800 dark:text-white dark:bg-emerald-600 px-4 py-2 rounded-md">
              <CheckCircle size={16} />
              Survey Completed
            </div>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white
              dark:text-white dark:bg-black
               px-4 py-2 rounded-md transition-colors font-medium w-full"
            >
              <RotateCcw size={16} />
              Reset Survey
            </button>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="mt-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-md">
        <p className="text-xs text-gray-600 dark:text-white ">
          {surveyStatus === 'Active' && 'Survey is currently active. You can pause it anytime.'}
          {surveyStatus === 'Paused' && 'Survey is paused. Click resume to continue.'}
          {surveyStatus === 'Completed' && 'Survey has been completed successfully.'}
        </p>
      </div>
    </div>
  );
}