const Card = ({ children, title, className = "", ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;