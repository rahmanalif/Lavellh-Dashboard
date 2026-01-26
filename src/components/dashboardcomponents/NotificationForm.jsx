import React, { useState } from 'react';

const NotificationForm = () => {
  const [selectedAudience, setSelectedAudience] = useState('All Users');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted");
  };

  return (
    <div className=" mx-auto p-4 bg-[#f4fafa] min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title Field */}
        <div>
          <label className="block text-gray-700 text-lg font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {/* Message Field */}
        <div>
          <label className="block text-gray-700 text-lg font-medium mb-2">
            Message
          </label>
          <textarea
            rows="6"
            placeholder="Write your notification message here..."
            className="w-full p-4 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm resize-none"
          ></textarea>
        </div>

        {/* Target Audience Section */}
        <div>
          <label className="block text-gray-700 text-lg font-medium mb-4">
            Target Audience
          </label>
          <div className="flex flex-wrap gap-6">
            {['All Users', 'All provider', 'All Business Owner', 'All Event manager'].map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="audience"
                    value={option}
                    checked={selectedAudience === option}
                    onChange={(e) => setSelectedAudience(e.target.value)}
                    className="appearance-none w-5 h-5 border-2 border-emerald-800 rounded-full checked:bg-emerald-800 checked:border-transparent focus:outline-none transition-all"
                  />
                  {/* Inner dot for radio button */}
                  {selectedAudience === option && (
                    <div className="absolute w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-emerald-900 font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full sm:w-80 bg-[#1e563b] hover:bg-[#16402c] text-white font-semibold py-3 px-10 rounded-lg transition-colors duration-200 shadow-md text-lg"
          >
            Confirm
          </button>
        </div>

      </form>
    </div>
  );
};

export default NotificationForm;