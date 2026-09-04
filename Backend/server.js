require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/database.js');

const utilisateurRoutes = require('./routes/utilisateurRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const quizRoutes = require('./routes/quizRoutes');
const boutiqueRoutes = require('./routes/boutiqueRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/user', utilisateurRoutes);
app.use('/categories', categorieRoutes);
app.use('/quizzes', quizRoutes);
app.use('/boutique', boutiqueRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    type_error: 'not-found',
    message: `Route ${req.method} ${req.originalUrl} introuvable`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;


async function start() {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Serveur sur http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Échec de connexion à la base de données :', err);
    process.exit(1);
  }
}

start();