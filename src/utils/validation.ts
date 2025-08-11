// Validation utilities for admission ID and accompanying count

export const validateAdmissionId = (id: string): { isValid: boolean; error?: string } => {
  if (!id || !id.trim()) {
    return { isValid: false, error: "Admission ID is required" };
  }

  const trimmedId = id.trim();

  if (trimmedId.length < 3) {
    return { isValid: false, error: "Admission ID must be at least 3 characters" };
  }

  if (trimmedId.length > 20) {
    return { isValid: false, error: "Admission ID cannot exceed 20 characters" };
  }

  if (!/^[A-Za-z0-9]+$/.test(trimmedId)) {
    return { isValid: false, error: "Admission ID can only contain letters and numbers" };
  }

  return { isValid: true };
};

export const validateAccompanyingCount = (count: number | string): { isValid: boolean; error?: string } => {
  const num = typeof count === 'string' ? parseInt(count) : count;

  if (isNaN(num)) {
    return { isValid: false, error: "Please enter a valid number" };
  }

  if (num < 0) {
    return { isValid: false, error: "Number cannot be negative" };
  }

  if (num > 10) {
    return { isValid: false, error: "Maximum 10 people allowed" };
  }

  if (!Number.isInteger(num)) {
    return { isValid: false, error: "Please enter a whole number" };
  }

  return { isValid: true };
};

export const sanitizeAdmissionId = (id: string): string => {
  return id.trim().toUpperCase();
};

export const formatUserName = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Generic validation function for any string field
export const validateStringField = (
  value: string, 
  fieldName: string, 
  minLength: number = 1, 
  maxLength: number = 100
): { isValid: boolean; error?: string } => {
  if (!value || !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  if (trimmedValue.length > maxLength) {
    return { isValid: false, error: `${fieldName} cannot exceed ${maxLength} characters` };
  }

  return { isValid: true };
};