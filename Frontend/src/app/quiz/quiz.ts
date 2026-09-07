import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz, Question } from '../models/quiz.models';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-quiz-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css'
})
export class QuizPlayComponent implements OnInit {
  quiz: Quiz | null = null;
  currentQuestionIndex = 0;
  reponsesUtilisateur: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.quizService.getParId(id).subscribe({
      next: (quiz) => this.quiz = quiz,
      error: (err) => console.error('Erreur chargement quiz', err)
    });
  }

  get currentQuestion(): Question | undefined {
    return this.quiz?.questions[this.currentQuestionIndex];
  }

  get totalQuestions(): number {
    return this.quiz?.questions.length ?? 0;
  }

  submitAnswer(option: 'A' | 'B' | 'C' | 'D'): void {
    const question = this.currentQuestion;
    if (!question) return;

    const texteReponse = {
      A: question.optionA,
      B: question.optionB,
      C: question.optionC,
      D: question.optionD
    }[option];

    this.reponsesUtilisateur[this.currentQuestionIndex] = texteReponse;

    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
    } else {
      this.terminerQuiz();
    }
  }

  private terminerQuiz(): void {

    if (!this.quiz) return;

    this.quizService
      .soumettreReponses(this.quiz._id, this.reponsesUtilisateur)
      .subscribe({

        next: (quiz) => {
          this.quiz = quiz;

          console.log('QUIZ :', quiz);
          console.log('IMAGE QUESTION 1 :', quiz.questions[0].image);
        },

        error: (err: any) => {
          console.error('Erreur soumission quiz', err);
        }

      });

  }
}