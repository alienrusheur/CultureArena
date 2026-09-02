function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

function error(res, message, statusCode = 500, type = 'ServerError') {
  return res.status(statusCode).json({
    success: false,
    type_error: type,
    message,
  });
}

module.exports = { success, error};