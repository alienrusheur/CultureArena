function errorHandler(err, req, res, next) {

  console.error('[ERREUR]', err.stack || err.message);
 
  res.status(err.status || 500).json({
    success: false,
    type_error: err.type || 'error',
    message: err.message || 'Erreur interne du serveur',
  });
}
 
module.exports = errorHandler;
 