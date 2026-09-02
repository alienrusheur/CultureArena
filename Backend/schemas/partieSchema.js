const mongoose = require('mongoose');

const partieSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Le quiz associé est requis'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: [true, "L'utilisateur associé est requis"],
    },
    score: {
      type: Number,
      required: [true, 'Le score est requis'],
      min: 0,
    },
  },
  {
    timestamps: { createdAt: 'date', updatedAt: false },
  }
);

partieSchema.index({ userId: 1 });
partieSchema.index({ quizId: 1, score: -1 });

module.exports = mongoose.model('Partie', partieSchema);