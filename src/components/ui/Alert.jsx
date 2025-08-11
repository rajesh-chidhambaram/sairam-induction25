const Alert = ({ type = "info", title, children, onClose, className = "" }) => {
  const alertTypes = {
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-400"
    },
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200", 
      textColor: "text-green-800",
      iconColor: "text-green-400"
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-400"
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-400"
    }
  };

  const { bgColor, borderColor, textColor, iconColor } = alertTypes[type];

  const icons = {
    error: "⚠️",
    success: "✅",
    warning: "⚠️",
    info: "ℹ️"
  };

  return (
    <div className={`${bgColor} ${borderColor} ${textColor} border-l-4 p-4 rounded-r-lg ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className={`${iconColor} text-lg`} aria-hidden="true">
            {icons[type]}
          </span>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">
              {title}
            </h3>
          )}
          <div className={`text-sm ${title ? 'mt-2' : ''}`}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`${textColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              aria-label="Close alert"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;