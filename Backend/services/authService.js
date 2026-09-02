const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../schemas/utilisateurSchema');

function serviceError(message, status, type) {
  const err = new Error(message);
  err.status = status;
  err.type = type;
  return err;
}

function genererToken(utilisateur) {
  return jwt.sign(
    { id: utilisateur._id, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function register({ pseudonyme, email, motDePasse }) {
  if (!pseudonyme || !email || !motDePasse) {
    throw serviceError('pseudonyme, email et motDePasse requis', 400, 'validator');
  }

  if (motDePasse.length < 8) {
    throw serviceError('Le mot de passe doit contenir au moins 8 caractères', 400, 'validator');
  }

  const emailExiste = await Utilisateur.findOne({ email: email.toLowerCase() });
  if (emailExiste) {
    throw serviceError('Cet email est déjà utilisé', 400, 'validator');
  }

  const motDePasseHash = await bcrypt.hash(motDePasse, 10);

  let nouvelUtilisateur;
  try {
    nouvelUtilisateur = await Utilisateur.create({
      pseudonyme,
      email,
      motDePasseHash,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw serviceError(err.message, 400, 'validator');
    }
    if (err.code === 11000) {
      throw serviceError('pseudonyme ou email déjà utilisé', 400, 'validator');
    }
    throw err;
  }

  const token = genererToken(nouvelUtilisateur);
  return { utilisateur: nouvelUtilisateur, token };
}

async function login({ email, motDePasse }) {
  if (!email || !motDePasse) {
    throw serviceError('email et motDePasse requis', 400, 'validator');
  }

  // motDePasseHash a select:false dans le schéma, on doit le redemander explicitement
  const utilisateur = await Utilisateur.findOne({ email: email.toLowerCase() }).select('+motDePasseHash');
  if (!utilisateur) {
    throw serviceError('Email ou mot de passe incorrect', 401, 'unauthorized');
  }

  const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasseHash);
  if (!motDePasseValide) {
    throw serviceError('Email ou mot de passe incorrect', 401, 'unauthorized');
  }

  const token = genererToken(utilisateur);
  return { utilisateur, token };
}

module.exports = { register, login };