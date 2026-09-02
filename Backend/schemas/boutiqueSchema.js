const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de l'article est requis"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
    },
    prix: {
      type: Number,
      required: [true, 'Le prix (en pièces) est requis'],
      min: 0,
    },
    type: {
      type: String,
      enum: ['cosmetique', 'avatar', 'titre', 'bonus'],
      default: 'cosmetique',
    },
    disponible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);