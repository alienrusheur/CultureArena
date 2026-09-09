import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Quiz } from '../models/quiz.models';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-liste-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-quiz.html',
  styleUrl: './liste-quiz.css'
})
export class ListeQuizComponent implements OnInit {

  quizs: Quiz[] = [];

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.quizService.getTous().subscribe({
      next: (quizs) => {
        this.quizs = quizs;
        console.log('Quiz récupérés :', quizs);
      },

      error: (err) => {
        console.error('Erreur chargement des quiz :', err);
      }
    });

  }

  jouerQuiz(id: string): void {
    this.router.navigate(['/quiz', id]);
  }
}