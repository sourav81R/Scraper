const sendSuccess = (
  res,
  {
    statusCode = 200,
    message = "Request completed successfully",
    data = null,
    meta = undefined,
  } = {}
) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null ? { data } : {}),
    ...(meta ? { meta } : {}),
  });

module.exports = { sendSuccess };
