"use client";

import { useEffect } from "react";
import AdmissionIdForm from "@/components/forms/AdmissionIdForm";
import AccompanyingCountForm from "@/components/forms/AccompanyingCountForm";
import useInductionForm from "@/hooks/useInductionForm";

export default function Home() {
  const {
    verified,
    userDetails,
    loading,
    error,
    successMessage,
    verifyId,
    updateAccompanyingCount,
    clearMessages
  } = useInductionForm();

  // Clear messages when component mounts
  useEffect(() => {
    clearMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sairam Induction 2025
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Welcome to your journey at Sairam Institutions. Let's get you registered for the induction ceremony.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex justify-center">
            {!verified ? (
              <AdmissionIdForm
                onVerify={verifyId}
                loading={loading}
                error={error}
              />
            ) : (
              <AccompanyingCountForm
                userDetails={userDetails}
                onUpdate={updateAccompanyingCount}
                loading={loading}
                error={error}
                successMessage={successMessage}
              />
            )}
          </div>

          {/* Additional Information */}
          {!verified && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Excellence</h3>
                <p className="text-gray-600 text-sm">Join a legacy of academic excellence and innovation in education.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bright Future</h3>
                <p className="text-gray-600 text-sm">Start your journey towards a successful and fulfilling career.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600 text-sm">Become part of a vibrant and supportive learning community.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
