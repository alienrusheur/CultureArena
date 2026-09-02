const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom de la catégorie est obligatoire'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'La description de la catégorie est obligatoire'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Categorie', categorieSchema);