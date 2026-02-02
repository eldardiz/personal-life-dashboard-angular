import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface QuestionStatus {
  q1: boolean | null;
  q2: boolean | null;
  q3: boolean | null;
  q4: boolean | null;
  q5: boolean | null;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent {
  userAnswers = {
    q1: '',
    q2: {
      HTML: false,
      CSS: false,
      JavaScript: false,
      PHP: false,
    },
    q3: '',
    q4: {
      commit: false,
      zip: false,
      readme: false,
      ignore: false,
    },
    q5: '',
  };

  correctAnswers = {
    q1: 'Stilizuje izgled stranice',
    q2: ['HTML', 'CSS', 'JavaScript'],
    q3: '<h1>',
    q4: ['Redovan commit na GitHub', 'Pisati README dokumentaciju'],
    q5: 'Sajt se prilagođava različitim veličinama ekrana',
  };

  // ← FIX: Explicit interface umjesto index signature
  questionStatus: QuestionStatus = {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  };

  score: number = 0;
  maxScore: number = 5;
  showResult: boolean = false;
  showRestartBtn: boolean = false;
  showPerfectOverlay: boolean = false;
  perfectShown: boolean = false;

  checkAnswers(): void {
    this.score = 0;

    // Q1
    if (this.userAnswers.q1 === this.correctAnswers.q1) {
      this.score++;
      this.questionStatus.q1 = true;
    } else {
      this.questionStatus.q1 = false;
    }

    // Q2
    const q2Selected: string[] = Object.keys(this.userAnswers.q2).filter(
      (key) => this.userAnswers.q2[key as keyof typeof this.userAnswers.q2],
    );

    const q2Correct =
      this.correctAnswers.q2.every((ans) => q2Selected.includes(ans)) &&
      q2Selected.every((ans) => this.correctAnswers.q2.includes(ans));

    if (q2Correct) {
      this.score++;
      this.questionStatus.q2 = true;
    } else {
      this.questionStatus.q2 = false;
    }

    // Q3
    if (this.userAnswers.q3 === this.correctAnswers.q3) {
      this.score++;
      this.questionStatus.q3 = true;
    } else {
      this.questionStatus.q3 = false;
    }

    // Q4
    const q4Selected: string[] = []; // ← FIX: Explicit type
    if (this.userAnswers.q4.commit) q4Selected.push('Redovan commit na GitHub');
    if (this.userAnswers.q4.readme)
      q4Selected.push('Pisati README dokumentaciju');
    if (this.userAnswers.q4.zip)
      q4Selected.push('Raditi sve u jednom ZIP fajlu bez historije');
    if (this.userAnswers.q4.ignore)
      q4Selected.push('Ignorisati dizajn i strukturu');

    const q4Correct =
      this.correctAnswers.q4.every((ans) => q4Selected.includes(ans)) &&
      q4Selected.every((ans) => this.correctAnswers.q4.includes(ans));

    if (q4Correct) {
      this.score++;
      this.questionStatus.q4 = true;
    } else {
      this.questionStatus.q4 = false;
    }

    // Q5
    if (this.userAnswers.q5 === this.correctAnswers.q5) {
      this.score++;
      this.questionStatus.q5 = true;
    } else {
      this.questionStatus.q5 = false;
    }

    this.showResult = true;
    this.showRestartBtn = true;

    if (this.score === this.maxScore && !this.perfectShown) {
      this.perfectShown = true;
      this.showPerfectOverlay = true;
    }
  }

  restart(): void {
    this.userAnswers = {
      q1: '',
      q2: { HTML: false, CSS: false, JavaScript: false, PHP: false },
      q3: '',
      q4: { commit: false, zip: false, readme: false, ignore: false },
      q5: '',
    };

    this.questionStatus = {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
    };

    this.score = 0;
    this.showResult = false;
    this.showRestartBtn = false;
    this.showPerfectOverlay = false;
    this.perfectShown = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  hidePerfectOverlay(): void {
    this.showPerfectOverlay = false;
  }
}
