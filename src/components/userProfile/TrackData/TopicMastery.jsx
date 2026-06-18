import React from "react";
import PropTypes from "prop-types";

const TopicMasteryList = ({ topics = [] }) => {
  return (
    <div className="flex flex-col gap-4">
      {topics.map((item, idx) => {
        // Fallback styling if specific color strings are missing
        const bgClass = item.bg || "bg-purple-50";
        const textClass = item.text || "text-purple-500";

        return (
          <div key={idx} className="flex items-center gap-3">
            {/* Dynamic Color-Coded Letter Grade Badge */}
            <div
              className={`w-9 h-9 rounded-full ${bgClass} flex items-center justify-center ${textClass} font-black text-xs shadow-sm border border-black/5 flex-shrink-0`}
            >
              {item.grade || "•"}
            </div>
            
            {/* Topic Information */}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-gray-800 leading-tight truncate">
                {item.title}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Defining explicit prop types for runtime validation and safety
TopicMasteryList.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      desc: PropTypes.string,
      grade: PropTypes.string,
      bg: PropTypes.string,
      text: PropTypes.string,
    })
  ),
};

export default TopicMasteryList;