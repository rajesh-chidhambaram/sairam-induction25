import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";

const AdmissionIdForm = ({ onVerify, loading, error }) => {
  const [id, setId] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateId = (value) => {
    if (!value.trim()) {
      return "Admission ID is required";
    }
    if (value.length < 3) {
      return "Admission ID must be at least 3 characters";
    }
    if (!/^[A-Za-z0-9]+$/.test(value)) {
      return "Admission ID can only contain letters and numbers";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateId(id);
    if (validation) {
      setValidationError(validation);
      return;
    }
    
    setValidationError("");
    onVerify(id);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setId(value);
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Induction Day 2025
        </h2>
        <p className="text-lg text-gray-600">
          Enter your Admission ID to get started
        </p>
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Admission ID"
          type="text"
          placeholder="Enter your admission ID"
          value={id}
          onChange={handleChange}
          error={validationError}
          required
          autoComplete="off"
          autoFocus
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={!id.trim() || loading}
        >
          {loading ? "Verifying..." : "Verify ID"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Need help? Contact the admissions office.
        </p>
      </div>
    </div>
  );
};

export default AdmissionIdForm;