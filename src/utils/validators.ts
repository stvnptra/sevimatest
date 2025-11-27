// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Password must be less than 128 characters' };
  }
  return { valid: true, message: '' };
};

// Strong password validation
export const isStrongPassword = (password: string): { valid: boolean; message: string; strength: number } => {
  let strength = 0;
  const messages: string[] = [];

  if (password.length >= 8) {
    strength += 1;
  } else {
    messages.push('At least 8 characters');
  }

  if (/[a-z]/.test(password)) {
    strength += 1;
  } else {
    messages.push('One lowercase letter');
  }

  if (/[A-Z]/.test(password)) {
    strength += 1;
  } else {
    messages.push('One uppercase letter');
  }

  if (/\d/.test(password)) {
    strength += 1;
  } else {
    messages.push('One number');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 1;
  } else {
    messages.push('One special character');
  }

  return {
    valid: strength >= 4,
    message: messages.length > 0 ? `Missing: ${messages.join(', ')}` : 'Strong password',
    strength
  };
};

// Display name validation
export const isValidDisplayName = (name: string): { valid: boolean; message: string } => {
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { valid: false, message: 'Display name must be at least 2 characters' };
  }
  if (trimmed.length > 50) {
    return { valid: false, message: 'Display name must be less than 50 characters' };
  }
  if (/[<>]/.test(trimmed)) {
    return { valid: false, message: 'Display name cannot contain < or >' };
  }
  return { valid: true, message: '' };
};

// Caption validation
export const isValidCaption = (caption: string): { valid: boolean; message: string } => {
  if (caption.length > 2200) {
    return { valid: false, message: 'Caption must be less than 2200 characters' };
  }
  return { valid: true, message: '' };
};

// Comment validation
export const isValidComment = (comment: string): { valid: boolean; message: string } => {
  const trimmed = comment.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, message: 'Comment cannot be empty' };
  }
  if (trimmed.length > 1000) {
    return { valid: false, message: 'Comment must be less than 1000 characters' };
  }
  return { valid: true, message: '' };
};

// Image file validation
export const isValidImageFile = (file: File): { valid: boolean; message: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }
  if (file.size > maxSize) {
    return { valid: false, message: 'Image size must be less than 5MB' };
  }
  return { valid: true, message: '' };
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Bio validation
export const isValidBio = (bio: string): { valid: boolean; message: string } => {
  if (bio.length > 150) {
    return { valid: false, message: 'Bio must be less than 150 characters' };
  }
  return { valid: true, message: '' };
};

// Sanitize text input (XSS prevention)
export const sanitizeText = (text: string): string => {
  return text
    // Handle ampersands first to prevent double-encoding
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    // Handle backticks which can be used in template literals
    .replace(/`/g, '&#96;');
};

// Validate and sanitize input
export const validateAndSanitize = (
  text: string,
  maxLength: number
): { valid: boolean; sanitized: string; message: string } => {
  const trimmed = text.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, sanitized: '', message: 'Input cannot be empty' };
  }
  if (trimmed.length > maxLength) {
    return { valid: false, sanitized: '', message: `Input must be less than ${maxLength} characters` };
  }
  
  return { valid: true, sanitized: sanitizeText(trimmed), message: '' };
};
