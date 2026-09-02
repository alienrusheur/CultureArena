const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('../schemas/utilisateurSchema');

function serviceError(message, status, type) {
  const err = new Error(message);
  err.status = status;
  err.type = type;
  return err;
}

function estIdValide(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getAll() {
  return Utilisateur.find();
}

async function getById(id) {
  if (!estIdValide(id)) {
    throw serviceError('Identifiant utilisateur invalide', 400, 'validator');
  }

  const u = await Utilisateur.findById(id);
  if (!u) {
    throw serviceError('Utilisateur non trouvé', 404, 'not-found');
  }
  return u;
}

async function update(id, userIdConnecte, { pseudonyme, email, motDePasse }) {
  if (!estIdValide(id)) {
    throw serviceError('Identifiant utilisateur invalide', 400, 'validator');
  }

  if (id !== userIdConnecte) {
    throw serviceError('Vous ne pouvez modifier que votre propre profil', 403, 'forbidden');
  }

  const donnees = {};
  if (pseudonyme) donnees.pseudonyme = pseudonyme;
  if (email) donnees.email = email;
  if (motDePasse) {
    if (motDePasse.length < 8) {
      throw serviceError('Le mot de passe doit contenir au moins 8 caractères', 400, 'validator');
    }
    donnees.motDePasseHash = await bcrypt.hash(motDePasse, 10);
  }

  try {
    const u = await Utilisateur.findByIdAndUpdate(id, donnees, {
      new: true,
      runValidators: true,
    });

    if (!u) {
      throw serviceError('Utilisateur non trouvé', 404, 'not-found');
    }

    return u;
  } catch (err) {
    if (err.status) throw err;
    if (err.name === 'ValidationError') {
      throw serviceError(err.message, 400, 'validator');
    }
    if (err.code === 11000) {
      throw serviceError('pseudonyme ou email déjà utilisé', 400, 'validator');
    }
    throw err;
  }
}

async function remove(id, userIdConnecte) {
  if (!estIdValide(id)) {
    throw serviceError('Identifiant utilisateur invalide', 400, 'validator');
  }

  if (id !== userIdConnecte) {
    throw serviceError('Vous ne pouvez supprimer que votre propre compte', 403, 'forbidden');
  }

  const supprime = await Utilisateur.findByIdAndDelete(id);
  if (!supprime) {
    throw serviceError('Utilisateur non trouvé', 404, 'not-found');
  }
  return supprime;
}

async function changerRole(id, nouveauRole) {
  if (!estIdValide(id)) {
    throw serviceError('Identifiant utilisateur invalide', 400, 'validator');
  }

  if (!['utilisateur', 'admin'].includes(nouveauRole)) {
    throw serviceError("Le rôle doit être 'utilisateur' ou 'admin'", 400, 'validator');
  }

  const u = await Utilisateur.findByIdAndUpdate(
    id,
    { role: nouveauRole },
    { new: true, runValidators: true }
  );

  if (!u) {
    throw serviceError('Utilisateur non trouvé', 404, 'not-found');
  }

  return u;
}

module.exports = { getAll, getById, update, remove, changerRole };