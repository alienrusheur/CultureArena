import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private quizService: QuizService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.quizService.getParId(id).subscribe({
      next: (quiz) => {
        console.log('QUIZ REÇU PAR ANGULAR :', quiz);
        console.log('QUESTIONS :', quiz.questions);
        console.log('NOMBRE DE QUESTIONS :', quiz.questions?.length);

        this.quiz = quiz;

        // Force Angular à mettre à jour l'affichage
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Erreur chargement quiz', err);
      }
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

  this.quizService.terminerQuiz(this.quiz._id, this.reponsesUtilisateur)
    .subscribe({
      next: (resultat) => {
        console.log('Résultat du quiz :', resultat);
        console.log('Points gagnés :', resultat.correction.pointsGagnes);
        console.log('Bonnes réponses :', resultat.correction.bonnesReponses, '/', resultat.correction.totalQuestions);

      },
      error: (err: any) => {
        console.error('Erreur soumission quiz', err);
      }
    });
}

  imageChargee(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.log('IMAGE CHARGÉE :', img.src);
  }

  imageErreur(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.error('ERREUR IMAGE :', img.src);
  }


}