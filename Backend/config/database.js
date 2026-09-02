const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB connecté avec succès');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;