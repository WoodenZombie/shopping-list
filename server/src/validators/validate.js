const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Enhanced validator returning structured maps for template compliance
// fields: { key: { required?:boolean, type?:'string'|'boolean'|'email', default?:any, max?:number, min?:number } }
function validate(fields, dtoIn, { allowExtraKeys = false } = {}) {
  const missingKeyMap = {};
  const invalidValueKeyMap = {};
  const invalidTypeKeyMap = {};
  const unsupportedKeyList = [];

  // Unsupported keys
  if (!allowExtraKeys) {
    for (const key of Object.keys(dtoIn || {})) {
      if (!(key in fields)) unsupportedKeyList.push(key);
    }
  }

  // Per-field checks and defaults
  for (const [key, rule] of Object.entries(fields)) {
    let value = dtoIn[key];
    const hasValue = !(value === undefined || value === null || value === "");

    if (rule.required && !hasValue) {
      if (rule.default !== undefined) {
        dtoIn[key] = rule.default; // apply default
        value = dtoIn[key];
      } else {
        missingKeyMap[key] = "is required";
        continue;
      }
    }

    // Type checks
    if (hasValue && rule.type === "boolean" && typeof value !== "boolean") {
      invalidTypeKeyMap[key] = "must be boolean";
    }
    if (hasValue && rule.type === "string") {
      if (typeof value !== "string") {
        invalidTypeKeyMap[key] = "must be string";
      } else {
        const min = rule.min ?? 1;
        const max = rule.max ?? 255;
        if (value.length < min || value.length > max) {
          invalidValueKeyMap[key] = `must be ${min}-${max} chars`;
        }
      }
    }
    if (hasValue && rule.type === "email" && !emailRegex.test(value)) {
      invalidValueKeyMap[key] = "must be valid email";
    }
  }

  const hasProblems =
    unsupportedKeyList.length > 0 ||
    Object.keys(missingKeyMap).length > 0 ||
    Object.keys(invalidTypeKeyMap).length > 0 ||
    Object.keys(invalidValueKeyMap).length > 0;

  return {
    dtoIn, // possibly with defaults applied
    validationResult: {
      unsupportedKeyList,
      missingKeyMap,
      invalidTypeKeyMap,
      invalidValueKeyMap
    },
    isValid: !hasProblems
  };
}

module.exports = validate;
