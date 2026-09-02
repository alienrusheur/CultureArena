const mongoose = require('mongoose');

const carteSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    last4: {
      type: String,
      required: true,
      match: [/^\d{4}$/, 'last4 doit contenir exactement 4 chiffres'],
    },
    tokenPaiement: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const expSchema = new mongoose.Schema(
  {
    actuel: {
      type: Number,
      default: 0,
      min: 0,
    },
    requis: {
      type: Number,
      default: 1000,
      min: 1,
    },
  },
  { _id: false }
);

const utilisateurSchema = new mongoose.Schema(
  {
    pseudonyme: {
      type: String,
      required: [true, 'Le pseudonyme est requis'],
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Le pseudonyme ne peut contenir que des lettres, chiffres, tirets et underscores',
      ],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide'],
    },
    motDePasseHash: {
      type: String,
      required: true,
      select: false,
    },
    carte: {
      type: carteSchema,
      default: null,
    },
    niveau: {
      type: Number,
      default: 1,
      min: 1,
    },
    role: {
      type: String,
      enum: ['utilisateur', 'admin'],
      default: 'utilisateur',
    },
    exp: {
      type: expSchema,
      default: () => ({ actuel: 0, requis: 1000 }),
    },
    nombredepieces: {
      type: Number,
      default: 0,
      min: 0,
    },
    inventaire: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Article',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'dateCreation', updatedAt: false },
  }
);

utilisateurSchema.methods.toJSON = function () {
  const objet = this.toObject();
  delete objet.motDePasseHash;
  return objet;
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);