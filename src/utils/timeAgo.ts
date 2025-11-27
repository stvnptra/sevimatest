import { Timestamp } from 'firebase/firestore';

type DateInput = Date | Timestamp | number | string;

// Convert various date formats to Date object
const toDate = (date: DateInput): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'number') {
    return new Date(date);
  }
  return new Date(date);
};

// Get time ago string from a date
export const timeAgo = (date: DateInput): string => {
  const now = new Date();
  const past = toDate(date);
  const diffMs = now.getTime() - past.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 5) {
    return 'just now';
  }
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }
  if (minutes === 1) {
    return '1 minute ago';
  }
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }
  if (hours === 1) {
    return '1 hour ago';
  }
  if (hours < 24) {
    return `${hours} hours ago`;
  }
  if (days === 1) {
    return 'yesterday';
  }
  if (days < 7) {
    return `${days} days ago`;
  }
  if (weeks === 1) {
    return '1 week ago';
  }
  if (weeks < 4) {
    return `${weeks} weeks ago`;
  }
  if (months === 1) {
    return '1 month ago';
  }
  if (months < 12) {
    return `${months} months ago`;
  }
  if (years === 1) {
    return '1 year ago';
  }
  return `${years} years ago`;
};

// Get short time ago string (e.g., "2h", "3d", "1w")
export const timeAgoShort = (date: DateInput): string => {
  const now = new Date();
  const past = toDate(date);
  const diffMs = now.getTime() - past.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) {
    return 'now';
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }
  if (hours < 24) {
    return `${hours}h`;
  }
  if (days < 7) {
    return `${days}d`;
  }
  if (weeks < 4) {
    return `${weeks}w`;
  }
  if (months < 12) {
    return `${months}mo`;
  }
  return `${years}y`;
};

// Format date for display
export const formatDate = (date: DateInput, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = toDate(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return dateObj.toLocaleDateString('en-US', options || defaultOptions);
};

// Format date and time for display
export const formatDateTime = (date: DateInput): string => {
  const dateObj = toDate(date);
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Check if date is today
export const isToday = (date: DateInput): boolean => {
  const dateObj = toDate(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

// Check if date is yesterday
export const isYesterday = (date: DateInput): boolean => {
  const dateObj = toDate(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateObj.toDateString() === yesterday.toDateString();
};

// Get relative date string (Today, Yesterday, or formatted date)
export const getRelativeDate = (date: DateInput): string => {
  if (isToday(date)) {
    const dateObj = toDate(date);
    return `Today at ${dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (isYesterday(date)) {
    const dateObj = toDate(date);
    return `Yesterday at ${dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return formatDateTime(date);
};
