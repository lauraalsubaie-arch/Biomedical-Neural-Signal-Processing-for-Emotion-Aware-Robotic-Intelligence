export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function required(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function validateAppointment({ dateTime, reason, type }) {
  const errors = {};
  if (!required(dateTime)) errors.dateTime = "Choose an appointment date and time.";
  if (dateTime && new Date(dateTime) <= new Date()) errors.dateTime = "Appointment must be in the future.";
  if (!required(reason) || reason.trim().length < 10) errors.reason = "Reason must be at least 10 characters.";
  if (!required(type)) errors.type = "Choose a visit type.";
  return errors;
}

export function validateMessage(text) {
  if (!required(text)) return "Message cannot be empty.";
  if (text.trim().length < 2) return "Message is too short.";
  if (text.length > 1000) return "Message must be under 1000 characters.";
  return "";
}
