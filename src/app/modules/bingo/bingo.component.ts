import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface BingoCell {
  text: string;
  free: boolean; // ← MORA biti "free" NE "isFree"
  marked: boolean;
  row: number;
  col: number;
}

@Component({
  selector: 'app-bingo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bingo.component.html',
  styleUrls: ['./bingo.component.css'],
})
export class BingoComponent implements OnInit {
  BINGO_SIZE = 5;
  FREE_TEXT = 'BESPLATNO POLJE';

  statements: string[] = [
    'Dolazi na vježbe prije početka časa.',
    'Voli raditi projekte u timu.',
    'Koristi tamni način rada (dark mode).',
    'Najdraži predmet mu je iz IT oblasti.',
    'Pije kafu prije predavanja.',
    'Koristi VS Code za programiranje.',
    'Voli HTML i CSS.',
    'Zanima ga frontend development.',
    'Sluša muziku dok uči.',
    'Voli rješavati logičke zadatke.',
    'Često koristi online kurseve za učenje.',
    'Radi projekte i van fakulteta.',
    'Voli JavaScript.',
    'Redovno provjerava e-mail sa faksa.',
    'Voli raditi dizajn web stranica.',
    'Prijavio se na barem jedan dodatni kurs.',
    'Ima omiljenu tipkovničku prečicu.',
    'Radi projekte kasno navečer.',
    'Radije uči uz video materijale.',
    'Voli raditi u timu od troje ljudi.',
    'Ima GitHub profil.',
    'Koristi barem jedan Linux distro.',
    'Prati tech YouTube kanale.',
    'Ne voli prezentirati pred velikom grupom.',
    'Voli raditi s podacima u Excelu.',
    'Ima ideju za vlastiti startup.',
    'Prati IT vijesti.',
    'Voli raditi wireframe u bilježnici.',
    'Ima spremljen folder sa korisnim kod primjerima.',
    'Pokušao je napraviti vlastiti portfolio sajt.',
  ];

  bingoBoard: BingoCell[][] = [];
  statusMessage: string = '';
  statusWin: boolean = false;
  showOverlay: boolean = false; // ← NE "showWinModal"
  winShown: boolean = false;
  winType: string = '';

  ngOnInit(): void {
    this.generateCard();
  }

  shuffle(arr: string[]): string[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  generateCard(): void {
    this.statusMessage = '';
    this.statusWin = false;
    this.winShown = false;
    this.showOverlay = false;

    const pool = this.shuffle(this.statements);
    const needed = this.BINGO_SIZE * this.BINGO_SIZE - 1;
    const chosen = pool.slice(0, needed);

    const cells: BingoCell[][] = [];
    let idx = 0;

    for (let r = 0; r < this.BINGO_SIZE; r++) {
      const row: BingoCell[] = [];
      for (let c = 0; c < this.BINGO_SIZE; c++) {
        if (r === 2 && c === 2) {
          row.push({
            text: this.FREE_TEXT,
            free: true,
            marked: true,
            row: r,
            col: c,
          });
        } else {
          row.push({
            text: chosen[idx++],
            free: false,
            marked: false,
            row: r,
            col: c,
          });
        }
      }
      cells.push(row);
    }

    this.bingoBoard = cells;
  }

  toggleCell(cell: BingoCell): void {
    // ← PRIMA SAMO CELL, NE (i, j)
    if (cell.free) return;
    cell.marked = !cell.marked;
    this.checkWin();
  }

  checkWin(): void {
    const grid: boolean[][] = Array.from({ length: this.BINGO_SIZE }, () =>
      Array(this.BINGO_SIZE).fill(false),
    );

    this.bingoBoard.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.marked) {
          grid[r][c] = true;
        }
      });
    });

    // Check rows
    for (let r = 0; r < this.BINGO_SIZE; r++) {
      if (grid[r].every((v) => v)) {
        this.declareWin(`Red ${r + 1}`);
        return;
      }
    }

    // Check columns
    for (let c = 0; c < this.BINGO_SIZE; c++) {
      let colOk = true;
      for (let r = 0; r < this.BINGO_SIZE; r++) {
        if (!grid[r][c]) {
          colOk = false;
          break;
        }
      }
      if (colOk) {
        this.declareWin(`Kolona ${c + 1}`);
        return;
      }
    }

    // Check diagonals
    if (
      Array.from({ length: this.BINGO_SIZE }, (_, i) => grid[i][i]).every(
        (v) => v,
      )
    ) {
      this.declareWin('Dijagonala 1');
      return;
    }

    if (
      Array.from(
        { length: this.BINGO_SIZE },
        (_, i) => grid[i][this.BINGO_SIZE - 1 - i],
      ).every((v) => v)
    ) {
      this.declareWin('Dijagonala 2');
      return;
    }
  }

  declareWin(type: string): void {
    if (this.winShown) return;
    this.winShown = true;
    this.statusMessage = `Bingo! ${type} je kompletiran.`;
    this.statusWin = true;
    this.winType = type;
    this.showOverlay = true;
  }

  hideOverlay(): void {
    // ← NE "closeModal"
    this.showOverlay = false;
  }

  resetMarks(): void {
    this.statusMessage = '';
    this.statusWin = false;
    this.winShown = false;

    this.bingoBoard.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.free) {
          cell.marked = false;
        }
      });
    });
  }

  exportPdf(): void {
    window.print();
  }

  newGameFromModal(): void {
    this.generateCard();
    this.hideOverlay();
  }

  resetFromModal(): void {
    this.resetMarks();
    this.hideOverlay();
  }

  printFromModal(): void {
    this.hideOverlay();
    this.exportPdf();
  }
}
