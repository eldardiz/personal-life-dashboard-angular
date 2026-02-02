import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-whiteboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.css'],
})
export class WhiteboardComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;

  // Toolbar state
  currentColor = '#1d4ed8';
  brushSize = 3;
  isErasing = false;

  // Mail popup
  showMailPopup = false;
  recipientEmail = '';
  emailError = false;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.drawWatermark();
  }

  // Drawing functions
  startDraw(e: MouseEvent | TouchEvent): void {
    this.drawing = true;
    this.draw(e);
  }

  endDraw(): void {
    this.drawing = false;
    this.ctx.beginPath();
  }

  draw(e: MouseEvent | TouchEvent): void {
    if (!this.drawing) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number;
    let clientY: number;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.isErasing ? '#FFFFFF' : this.currentColor;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  // Toolbar actions
  onColorChange(): void {
    this.isErasing = false;
  }

  toggleEraser(): void {
    this.isErasing = !this.isErasing;
  }

  clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawWatermark();
  }

  saveImage(): void {
    const canvas = this.canvasRef.nativeElement;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'whiteboard_crtez.png';
    link.click();
  }

  exportPdf(): void {
    window.print();
  }

  // Watermark
  drawWatermark(): void {
    const canvas = this.canvasRef.nativeElement;
    const img = new Image();
    img.src = 'assets/images/logo-ipi.png';

    img.onload = () => {
      const logoWidth = 180;
      const logoHeight = (img.height / img.width) * logoWidth;
      const x = (canvas.width - logoWidth) / 2;
      const y = (canvas.height - logoHeight) / 2;

      this.ctx.save();
      this.ctx.globalAlpha = 0.08;
      this.ctx.drawImage(img, x, y, logoWidth, logoHeight);
      this.ctx.restore();
    };
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

    const bodyText =
      'Pozdrav,\n\n' +
      'U prilogu uz ovu poruku šaljem sadržaj Whiteboarda.\n' +
      'Lijep pozdrav!';

    const mailtoLink =
      `mailto:${encodeURIComponent(this.recipientEmail)}` +
      `?subject=${encodeURIComponent('IPI Whiteboard – Student Fun Zone')}` +
      `&body=${encodeURIComponent(bodyText)}`;

    window.location.href = mailtoLink;
    this.closeMailPopup();
  }
}
