import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

// Safe HTML Pipe
@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

interface BoardItem {
  type: 'note' | 'quote' | 'image';
  className: string;
  html: string;
  left: number;
  top: number;
}

@Component({
  selector: 'app-vision-board',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SafeHtmlPipe],
  templateUrl: './vision-board.component.html',
  styleUrls: ['./vision-board.component.css'],
})
export class VisionBoardComponent implements OnInit {
  @ViewChild('boardElement') boardElement!: ElementRef;

  STORAGE_KEY = 'visualBoardItems';
  RECENT_KEY = 'visualBoardRecent';

  boardItems: BoardItem[] = [];
  recentRemoved: BoardItem[] = [];

  // Drag state
  isDragging = false;
  currentDragIndex: number | null = null;
  offsetX = 0;
  offsetY = 0;

  // Mail popup
  showMailPopup = false;
  recipientEmail = '';
  emailError = false;

  // Colors for post-it notes
  colors = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6'];

  // Sample images
  sampleImages = [
    'assets/images/vision/vision1.jpg',
    'assets/images/vision/vision2.jpg',
    'assets/images/vision/vision3.jpg',
    'assets/images/vision/vision4.jpg',
    'assets/images/vision/vision5.jpg',
    'assets/images/vision/vision6.jpg',
    'assets/images/vision/vision7.jpg',
    'assets/images/vision/vision8.jpg',
  ];

  // Sample quotes
  sampleQuotes = [
    'Danas učiš malo, sutra ti to spašava projekat.',
    'Neka radi, neka bude ispravno, neka bude brzo.',
    'Nije bitno da je savršeno, bitno je da radi.',
    'Prvo napravi da radi, pa onda uljepšaj.',
    'Svaki bug je samo još jedna lekcija.',
  ];

  ngOnInit(): void {
    this.loadBoard();
    this.loadRecent();
  }

  // Add post-it note
  addNote(): void {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const item: BoardItem = {
      type: 'note',
      className: `note ${color}`,
      html: 'Napiši nešto...',
      left: Math.random() * 520,
      top: Math.random() * 280,
    };
    this.boardItems.push(item);
    this.saveBoard(true);
  }

  // Add image
  addImage(): void {
    const imgSrc =
      this.sampleImages[Math.floor(Math.random() * this.sampleImages.length)];
    const item: BoardItem = {
      type: 'image',
      className: 'pinned-img',
      html: `<img src="${imgSrc}" alt="Vision slika">`,
      left: Math.random() * 460,
      top: Math.random() * 240,
    };
    this.boardItems.push(item);
    this.saveBoard(true);
  }

  // Add quote
  addQuote(): void {
    const quote =
      this.sampleQuotes[Math.floor(Math.random() * this.sampleQuotes.length)];
    const item: BoardItem = {
      type: 'quote',
      className: 'quote',
      html: quote,
      left: Math.random() * 460,
      top: Math.random() * 240,
    };
    this.boardItems.push(item);
    this.saveBoard(true);
  }

  // Remove item (pin button)
  removeItem(index: number, event: Event): void {
    event.stopPropagation();
    const item = this.boardItems[index];
    this.boardItems.splice(index, 1);
    this.pushRecent(item);
    this.saveBoard(true);
  }

  // Drag functionality
  startDrag(event: MouseEvent, index: number): void {
    if ((event.target as HTMLElement).classList.contains('delete-btn')) {
      return;
    }

    this.isDragging = true;
    this.currentDragIndex = index;
    const item = this.boardItems[index];
    this.offsetX = event.clientX - item.left;
    this.offsetY = event.clientY - item.top;

    const mouseMoveHandler = (e: MouseEvent) => this.onDrag(e);
    const mouseUpHandler = () =>
      this.stopDrag(mouseMoveHandler, mouseUpHandler);

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  onDrag(event: MouseEvent): void {
    if (this.isDragging && this.currentDragIndex !== null) {
      event.preventDefault();
      this.boardItems[this.currentDragIndex].left =
        event.clientX - this.offsetX;
      this.boardItems[this.currentDragIndex].top = event.clientY - this.offsetY;
    }
  }

  stopDrag(
    mouseMoveHandler: (e: MouseEvent) => void,
    mouseUpHandler: () => void,
  ): void {
    this.isDragging = false;
    this.currentDragIndex = null;
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    this.saveBoard(true);
  }

  // Storage
  saveBoard(silent = false): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.boardItems));
    localStorage.setItem(this.RECENT_KEY, JSON.stringify(this.recentRemoved));
    if (!silent) {
      alert('Ploča je snimljena!');
    }
  }

  loadBoard(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        this.boardItems = JSON.parse(data);
      } catch {
        this.boardItems = [];
      }
    }
  }

  clearBoard(): void {
    if (confirm('Obrisati cijelu ploču?')) {
      this.boardItems = [];
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Recent items
  pushRecent(item: BoardItem): void {
    this.recentRemoved.unshift(item);
    if (this.recentRemoved.length > 3) {
      this.recentRemoved = this.recentRemoved.slice(0, 3);
    }
    localStorage.setItem(this.RECENT_KEY, JSON.stringify(this.recentRemoved));
  }

  loadRecent(): void {
    const data = localStorage.getItem(this.RECENT_KEY);
    if (data) {
      try {
        this.recentRemoved = JSON.parse(data);
      } catch {
        this.recentRemoved = [];
      }
    }
  }

  restoreRecent(index: number): void {
    const item = this.recentRemoved[index];
    if (!item) return;

    const restoredItem: BoardItem = {
      ...item,
      left: Math.random() * 120,
      top: Math.random() * 90,
    };

    this.boardItems.push(restoredItem);
    this.recentRemoved.splice(index, 1);
    this.saveBoard(true);
  }

  clearRecent(): void {
    if (confirm('Očistiti sve skinute pinove?')) {
      this.recentRemoved = [];
      localStorage.setItem(this.RECENT_KEY, JSON.stringify(this.recentRemoved));
    }
  }

  // Helper functions
  getItemPreview(item: BoardItem): string {
    const prefix = item.type === 'note' ? 'Bilješka: ' : 'Citat: ';
    const text = this.stripHTML(item.html);
    return prefix + this.truncate(text, 40);
  }

  stripHTML(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }

  truncate(text: string, length: number): string {
    return text.length > length ? text.slice(0, length - 3) + '...' : text;
  }

  extractImageSrc(html: string): string {
    const match = html.match(/src="([^"]+)"/);
    return match ? match[1] : '';
  }

  // Export
  exportPdf(): void {
    window.print();
  }

  // Mail popup
  openMailPopup(): void {
    this.showMailPopup = true;
    this.recipientEmail = '';
    this.emailError = false;
  }

  closeMailPopup(): void {
    this.showMailPopup = false;
  }

  sendEmail(): void {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      this.recipientEmail.trim(),
    );

    if (!emailValid) {
      this.emailError = true;
      return;
    }

    const bodyText = 'Hej!\n\nEvo ti moj Visual Board sa Fun Zone.\nPozz!';
    const mailtoLink = `mailto:${encodeURIComponent(this.recipientEmail)}?subject=${encodeURIComponent('Moj Visual Board – Student Fun Zone')}&body=${encodeURIComponent(bodyText)}`;

    window.location.href = mailtoLink;
    this.closeMailPopup();
  }
}
