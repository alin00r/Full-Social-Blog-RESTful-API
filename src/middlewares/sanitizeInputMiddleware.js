const sanitizeString = (value) =>
  value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');

const sanitizeDeep = (input) => {
  if (typeof input === 'string') {
    return sanitizeString(input);
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeDeep);
  }

  if (input && typeof input === 'object') {
    const sanitized = {};
    Object.keys(input).forEach((key) => {
      sanitized[key] = sanitizeDeep(input[key]);
    });
    return sanitized;
  }

  return input;
};

module.exports = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeDeep(req.body);
  }

  if (req.params) {
    req.params = sanitizeDeep(req.params);
  }

  if (req.query && typeof req.query === 'object') {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = sanitizeDeep(req.query[key]);
    });
  }

  next();
};
