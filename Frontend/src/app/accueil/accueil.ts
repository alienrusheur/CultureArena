import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { Quiz } from '../models/quiz.models';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})

export class AccueilComponent implements OnInit {

  credentials = {
    recherche: ''
  };

  nomUtilisateur = 'Rayane';

  tesQuiz: Quiz[] = [];

  quizDuJour: Quiz | null = null;

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.quizService.getTous().subscribe({
      next: (quiz: Quiz[]) => {
        console.log('QUIZ RECUS PAR ANGULAR :', quiz);
        console.log('NOMBRE DE QUIZ :', quiz.length);

        this.tesQuiz = quiz;
        this.quizDuJour = quiz.length > 0 ? quiz[quiz.length - 1] : null;
      },

      error: (err: any) => {
        console.error('STATUS :', err.status);
        console.error('MESSAGE :', err.message);
        console.error('URL :', err.url);
        console.error('ERROR :', err.error);
      }
    });
  }

  supprimerQuiz(quiz: Quiz): void {

    console.log('Supprimer', quiz.nomQuiz);

    this.quizService.supprimer(quiz._id).subscribe({
      next: () => {
        this.tesQuiz = this.tesQuiz.filter(
          q => q._id !== quiz._id
        );
      },
      error: (err: Error) => {
        console.error('Erreur suppression quiz', err);
      }
    });

  }

  modifierQuiz(quiz: Quiz): void {
    console.log('Modifier', quiz.nomQuiz);
  }

  lancerQuizDuJour(): void {
    if (!this.quizDuJour) return;
    console.log('Lancer', this.quizDuJour.nomQuiz);
  }
}