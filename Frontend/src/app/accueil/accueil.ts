import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    CommonModule, FormsModule,
    MatToolbarModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatCardModule
  ],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class AccueilComponent implements OnInit {
  credentials = { recherche: '' };
  nomUtilisateur = 'Rayane';

  tesQuiz = signal<Quiz[]>([]);
  quizDuJour = signal<Quiz | null>(null);

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit(): void {
    this.quizService.getTous().subscribe({
      next: (quiz: Quiz[]) => {
        this.tesQuiz.set(quiz);
        this.quizDuJour.set(quiz.find(q => q.estQuizDuJour) ?? null);
      },
      error: (err: any) => console.error('Erreur chargement quiz', err)
    });
  }

  supprimerQuiz(quiz: Quiz): void {
    this.quizService.supprimer(quiz._id).subscribe({
      next: () => {
        this.tesQuiz.update(liste => liste.filter(q => q._id !== quiz._id));
      },
      error: (err: Error) => console.error('Erreur suppression quiz', err)
    });
  }

  modifierQuiz(quiz: Quiz): void {
    this.router.navigateByUrl(`/quiz/${quiz._id}/modifier`);
  }

  lancerQuiz(quiz: Quiz): void {
    this.router.navigate(['/quiz', quiz._id]);
  }

  lancerQuizDuJour(): void {
    const quiz = this.quizDuJour();

    if (!quiz) return;

    this.router.navigate(['/quiz', quiz._id]);
  }
}