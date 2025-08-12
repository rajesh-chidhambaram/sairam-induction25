import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

const AccompanyingCountForm = ({ userDetails, onUpdate, loading }) => {
  const [accompanyingCount, setAccompanyingCount] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateCount = (value) => {
    const num = parseInt(value);
    if (isNaN(num)) {
      return "Please enter a valid number";
    }
    if (num < 0) {
      return "Number cannot be negative";
    }
    if (num > 10) {
      return "Maximum 10 people allowed";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateCount(accompanyingCount);
    if (validation) {
      setValidationError(validation);
      return;
    }
    
    setValidationError("");
    onUpdate(parseInt(accompanyingCount));
    setAccompanyingCount("");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setAccompanyingCount(value);
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  // Decide button label based on current parentCount
  const isAdding = userDetails.parentCount==0;
  const buttonLabel = isAdding? "Add Count" : "Update Count";
  const buttonLoadingLabel = isAdding? "Addinng..." : "Updating...";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Welcome Card */}
      <Card>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {userDetails.name}!
          </h2>
          <p className="text-gray-600 mb-4">
            Your admission ID <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userDetails.id}</span> has been verified successfully.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              Current accompanying count: {userDetails.parentCount} people
            </p>
          </div>
        </div>
      </Card>

      {/* Accompanying Count Form */}
      <Card title="Update Accompanying Count">
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of People Accompanying
          </label>
          <select
            value={accompanyingCount}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
          <option value="" disabled>Select count</option>
          {[...Array(11)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          )}


          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Important Guidelines:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Maximum 10 people can accompany you</li>
              <li>• This includes parents, guardians, and family members</li>
              <li>• Children above 5 years count towards this limit</li>
              <li>• You can update this count multiple times if needed</li>
            </ul>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!accompanyingCount || loading}
          >
            {loading ? buttonLoadingLabel : buttonLabel}
          </Button>
        </form>
      </Card>

      {/* Next Steps */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
            <p>Arrive at the campus on induction day with your family</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
            <p>Present your admission ID at the registration desk</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
            <p>Follow the guidance of our staff for seating arrangements</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccompanyingCountForm;