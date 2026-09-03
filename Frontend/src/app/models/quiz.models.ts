export interface Question {
  _id?: string;
  enonce: string;
  reponse: string;
  estCorrecte?: boolean;
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
  favoris: boolean;
  niveau: number;
  nombreDeParticipation: number;
  nombreDeJoueurs: number;
  pointActuel: PointActuel;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreerQuizPayload {
  nomQuiz: string;
  description: string;
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