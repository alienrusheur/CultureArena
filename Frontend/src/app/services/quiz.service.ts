import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse } from '../models/auth.models';
import {
  CreerQuizPayload,
  ModifierQuizPayload,
  Quiz
} from '../models/quiz.models';

const API_URL = 'http://localhost:3000/quizzes';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  getTous(): Observable<Quiz[]> {
    return this.http
      .get<ApiResponse<Quiz[]>>(API_URL)
      .pipe(
        map(res => {
          if (!res.success) {
            throw new Error(res.message);
          }

          return res.data;
        })
      );
  }

  getMesQuiz(): Observable<Quiz[]> {
    return this.getTous();
  }

  getParId(id: string): Observable<Quiz> {
    return this.http
      .get<ApiResponse<Quiz>>(`${API_URL}/${id}`)
      .pipe(
        map(res => {
          if (!res.success) {
            throw new Error(res.message);
          }

          return res.data;
        })
      );
  }

  getQuizDuJour(): Observable<Quiz | null> {
    return this.getTous().pipe(
      map((quizzes) => {
        if (quizzes.length === 0) return null;
        // Le plus populaire = le quiz du jour
        return quizzes.reduce((leaderActuel, quizCourant) =>
          quizCourant.nombreDeJoueurs > leaderActuel.nombreDeJoueurs ? quizCourant : leaderActuel
        );
      })
    );
  }

  creer(payload: CreerQuizPayload): Observable<Quiz> {
    return this.http
      .post<ApiResponse<Quiz>>(API_URL, payload)
      .pipe(
        map(res => {
          if (!res.success) {
            throw new Error(res.message);
          }

          return res.data;
        })
      );
  }

  definirQuizDuJour(id: string): Observable<Quiz> {
    return this.http
      .put<ApiResponse<Quiz>>(`${API_URL}/${id}/quiz-du-jour`, {})
      .pipe(
        map(res => {
          if (!res.success) throw new Error(res.message);
          return res.data;
        })
      );
  }

  modifier(
    id: string,
    payload: ModifierQuizPayload
  ): Observable<Quiz> {
    return this.http
      .put<ApiResponse<Quiz>>(`${API_URL}/${id}`, payload)
      .pipe(
        map(res => {
          if (!res.success) {
            throw new Error(res.message);
          }

          return res.data;
        })
      );
  }

  supprimer(id: string): Observable<Quiz> {
    return this.http
      .delete<ApiResponse<Quiz>>(`${API_URL}/${id}`)
      .pipe(
        map(res => {
          if (!res.success) {
            throw new Error(res.message);
          }

          return res.data;
        })
      );


  }

    terminerQuiz(
    quizId: string,
    reponses: string[]
  ): Observable<any> {

    return this.http
      .post<ApiResponse<any>>(
        `${API_URL}/${quizId}/terminer`,
        { reponses }
      )
      .pipe(
        map(res => {
          if (!res.success) {
            throw new Error(res.message);
          }

          return res.data;
        })
      );
  }
}