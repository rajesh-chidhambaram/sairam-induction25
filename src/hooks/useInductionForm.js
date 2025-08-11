import { useState, useCallback } from "react";

const useInductionForm = () => {
  const [verified, setVerified] = useState(false);
  const [userDetails, setUserDetails] = useState({
    id: "",
    name: "",
    parentCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  const verifyId = async (id) => {
    if (!id?.trim()) {
      setError("Please enter a valid admission ID");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/verifyId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserDetails(data.details);
        setVerified(true);
        setSuccessMessage("ID verified successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.message || "Failed to verify ID. Please check your admission ID and try again.");
      }
    } catch (error) {
      console.error("Error verifying ID:", error);
      setError("Unable to connect to the server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateAccompanyingCount = async (count) => {
    if (count < 0 || count > 10) {
      setError("Please enter a valid count between 0 and 10");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/updateId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: userDetails.id, 
          accompanyingCount: count 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserDetails(prev => ({
          ...prev,
          parentCount: data.parentCount
        }));
        setSuccessMessage(`Accompanying count updated to ${data.parentCount} people successfully!`);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setError(data.message || "Failed to update accompanying count. Please try again.");
      }
    } catch (error) {
      console.error("Error updating count:", error);
      setError("Unable to connect to the server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVerified(false);
    setUserDetails({
      id: "",
      name: "",
      parentCount: 0
    });
    setLoading(false);
    setError("");
    setSuccessMessage("");
  };

  return {
    verified,
    userDetails,
    loading,
    error,
    successMessage,
    verifyId,
    updateAccompanyingCount,
    resetForm,
    clearMessages
  };
};

export default useInductionForm;