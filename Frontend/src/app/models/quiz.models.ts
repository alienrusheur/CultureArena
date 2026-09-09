export interface Question {
  _id?: string;
  enonce: string;
  image?: string;

  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;

  reponse: string;
  points?: number;
  piecesGagnees?: number;
}
export interface PointActuel {
  actuel: number;
  max: number;
}

export interface Quiz {
  _id: string;
  nomQuiz: string;
  createurId: string;
  description: string;
  image: string;
  favoris: boolean;
  niveau: number;
  nombreDeParticipation: number;
  nombreDeJoueurs: number;
  nombreQuestions: number;
  estQuizDuJour: boolean;
  pointActuel: PointActuel;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreerQuizPayload {
  nomQuiz: string;
  description: string;
  image?: string;
  favoris?: boolean;
  niveau?: number;
  questions: Question[];
}

export interface ModifierQuizPayload {
  nomQuiz?: string;
  description?: string;
  favoris?: boolean;
  niveau?: number;
  questions?: Question[];
  pointActuel?: PointActuel;
}