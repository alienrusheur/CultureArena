const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    enonce: { type: String, required: true, trim: true },
    optionA: { type: String, required: true, trim: true },
    optionB: { type: String, required: true, trim: true },
    optionC: { type: String, required: true, trim: true },
    optionD: { type: String, required: true, trim: true },
    reponse: { type: String, required: true, trim: true },
    points: { type: Number, default: 0, min: 0 },
    piecesGagnees: { type: Number, default: 0, min: 0 },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    nomQuiz: { type: String, required: true, trim: true },
    createurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: { type: String, required: true, trim: true },

    image: { 
      type: String, 
      default: '/image/imagePlanete.png' 
    },

    favoris: { type: Boolean, default: false },
    niveau: { type: Number, default: 1, min: 1 },
    nombreDeParticipation: { type: Number, default: 0, min: 0 },
    nombreDeJoueurs: { type: Number, default: 0, min: 0 },
    nombreQuestions: { type: Number, default: 0, min: 0 },
    pointActuel: {
      actuel: { type: Number, default: 0, min: 0 },
      max: { type: Number, default: 0, min: 0 },
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Un quiz doit contenir au moins une question',
      },
    },
  },
  { timestamps: true }
);

quizSchema.pre('save', function (next) {
  this.nombreQuestions = this.questions.length;
});

module.exports = mongoose.model('Quiz', quizSchema);