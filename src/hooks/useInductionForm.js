import { useState, useCallback } from "react";
import { toast } from "sonner";

const useInductionForm = () => {
  const [verified, setVerified] = useState(false);
  const [userDetails, setUserDetails] = useState({
    id: "",
    name: "",
    parentCount: 0
  });
  const [loading, setLoading] = useState(false);

  const verifyId = async (id) => {
    if (!id?.trim()) {
      toast.error("Please enter a valid admission ID");
      return;
    }

    setLoading(true);
    
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
        toast.success("ID verified successfully!");
      } else {
        toast.error(data.message || "Failed to verify ID. Please check your admission ID and try again.");
      }
    } catch (error) {
      console.error("Error verifying ID:", error);
      toast.error("Unable to connect to the server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateAccompanyingCount = async (count) => {
    if (count < 0 || count > 10) {
      toast.error("Please enter a valid count between 0 and 10");
      return;
    }

    setLoading(true);
    
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
        toast.success(`Accompanying count updated to ${data.parentCount} people successfully!`);
      } else {
        toast.error(data.message || "Failed to update accompanying count. Please try again.");
      }
    } catch (error) {
      console.error("Error updating count:", error);
      toast.error("Unable to connect to the server. Please check your internet connection and try again.");
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
  };

  return {
    verified,
    userDetails,
    loading,
    verifyId,
    updateAccompanyingCount,
    resetForm
  };
};

export default useInductionForm;