import { Component, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { ClassementEntree } from '../models/quiz.models';

interface ResultatQuiz {
  correction: {
    quizId: string;
    totalQuestions: number;
    bonnesReponses: number;
    pointsGagnes: number;
    piecesGagnees: number;
  };
  recompenses?: any;
  utilisateur?: any;
}

@Component({
  selector: 'app-quiz-resultat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-resultat.html',
  styleUrl: './quiz-resultat.css'
})
export class QuizResultatComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);   // ← ajout ici

  resultat: ResultatQuiz | null = null;
  classement: ClassementEntree[] = [];

  constructor(
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? history.state;

    if (state && state['resultat']) {
      this.resultat = state['resultat'];
      this.chargerClassement();
    }
  }

  private chargerClassement(): void {
    const quizId = this.resultat?.correction?.quizId;
    if (!quizId) return;

    this.quizService.getClassement(quizId).subscribe({
      next: (classement) => {
        this.classement = classement;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement classement', err)
    });
  }

  get podium(): ClassementEntree[] {
    return this.classement.slice(0, 3);
  }

  medaille(position: number): string {
    if (position === 0) return '/image/MedaillePremier.png';
    if (position === 1) return '/image/Medaille2eme.png';
    return '/image/Medaille3eme.png';
  }

  partagerResultat(): void {
    console.log('Partager le résultat');
  }

  retourAccueil(): void {
    this.router.navigateByUrl('/accueil');
  }
}