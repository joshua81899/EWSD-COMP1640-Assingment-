import React from 'react';

/**
 * ImportantDateItem component for displaying important dates in the sidebar
 * 
 * @param {Object} props
 * @param {string} props.title - Title of the important date (e.g., "Submission Deadline")
 * @param {string} props.date - The date to display (e.g., "May 25, 2025")
 * @param {string} props.className - Additional CSS classes
 */
const ImportantDateItem = ({
  title,
  date,
  className = ''
}) => {
  return (
    <div className={`bg-gray-700 rounded-md p-3 text-sm ${className}`}>
      <p className="text-white font-medium">{title}:</p>
      <p className="text-yellow-400">{date}</p>
    </div>
  );
};

export default ImportantDateItem;