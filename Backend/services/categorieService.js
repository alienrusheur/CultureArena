const mongoose = require('mongoose');
const Categorie = require('../schemas/categorieSchema');

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
  return Categorie.find();
}

async function getById(id) {
  if (!estIdValide(id)) {
    throw serviceError('Identifiant de catégorie invalide', 400, 'validator');
  }

  const c = await Categorie.findById(id);
  if (!c) {
    throw serviceError('Catégorie non trouvée', 404, 'not-found');
  }
  return c;
}

async function create({ nom, description }) {
  if (!nom || !description) {
    throw serviceError('nom et description requis', 400, 'validator');
  }

  try {
    return await Categorie.create({ nom, description });
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw serviceError(err.message, 400, 'validator');
    }
    if (err.code === 11000) {
      throw serviceError('Cette catégorie existe déjà', 400, 'validator');
    }
    throw err;
  }
}

async function update(id, { nom, description }) {
  if (!estIdValide(id)) {
    throw serviceError('Identifiant de catégorie invalide', 400, 'validator');
  }

  try {
    const c = await Categorie.findByIdAndUpdate(
      id,
      { nom, description },
      { new: true, runValidators: true }
    );

    if (!c) {
      throw serviceError('Catégorie non trouvée', 404, 'not-found');
    }

    return c;
  } catch (err) {
    if (err.status) throw err;
    if (err.name === 'ValidationError') {
      throw serviceError(err.message, 400, 'validator');
    }
    if (err.code === 11000) {
      throw serviceError('Cette catégorie existe déjà', 400, 'validator');
    }
    throw err;
  }
}

async function remove(id) {
  if (!estIdValide(id)) {
    throw serviceError('Identifiant de catégorie invalide', 400, 'validator');
  }

  const supprime = await Categorie.findByIdAndDelete(id);
  if (!supprime) {
    throw serviceError('Catégorie non trouvée', 404, 'not-found');
  }
  return supprime;
}

module.exports = { getAll, getById, create, update, remove };