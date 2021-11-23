const errorResponse = (res, code, data, message) => {
  res.status(code).json({
    message: message || "Internal Server Error",
    data,
    error: true,
  });
};

const successResponse = (res, code, data, message) => {
  res.status(code).json({
    message: message || "Success",
    data,
    error: false,
  });
};

module.exports = { errorResponse, successResponse };
