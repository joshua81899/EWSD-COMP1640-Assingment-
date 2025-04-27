import React from 'react';

/**
 * StatCard component for displaying a statistic with an icon
 * 
 * @param {Object} props
 * @param {string} props.title - Title of the statistic
 * @param {number|string} props.value - Value to display
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.iconColor - CSS color class for the icon (default: text-blue-400)
 * @param {Function} props.onClick - Optional onClick handler
 * @param {string} props.className - Additional CSS classes to apply
 */
const StatCard = ({
  title,
  value,
  icon,
  iconColor = 'text-blue-400',
  onClick,
  className = '',
  ...rest
}) => {
  return (
    <div 
      className={`bg-gray-900 rounded-lg p-4 border border-gray-700 ${onClick ? 'cursor-pointer hover:border-gray-500' : ''} ${className}`}
      onClick={onClick}
      {...rest}
    >
      <h4 className="text-sm font-medium text-gray-400 uppercase mb-2">{title}</h4>
      <div className="flex items-center">
        <span className="text-3xl font-bold text-white">{value}</span>
        {icon && (
          <div className={`ml-auto ${iconColor}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;