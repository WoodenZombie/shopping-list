const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validate(fields, dtoIn) {
  const errors = {};
  for (const [key, rule] of Object.entries(fields)) {
    const value = dtoIn[key];
    if (rule.required && (value === undefined || value === null || value === "")) {
      errors[key] = "is required";
    }
    if (rule.type === "string" && value && (value.length < 1 || value.length > 255)) {
      errors[key] = "must be 1-255 chars";
    }
    if (rule.type === "boolean" && typeof value !== "boolean") {
      errors[key] = "must be boolean";
    }
    if (rule.type === "email" && value && !emailRegex.test(value)) {
      errors[key] = "must be valid email";
    }
  }
  return errors;
}
module.exports = validate;
