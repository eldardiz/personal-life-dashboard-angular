import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Task {
  id: string;
  text: string;
  status: 'todo' | 'inprogress' | 'done';
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
})
export class KanbanBoardComponent implements OnInit {
  @ViewChild('kanbanPrintArea') kanbanPrintArea!: ElementRef;

  STORAGE_KEY = 'kanbanBoardTasks';

  tasks: Task[] = [];
  draggedTask: Task | null = null;

  // Task modal
  showTaskModal: boolean = false;
  newTaskText: string = '';
  newTaskStatus: 'todo' | 'inprogress' | 'done' = 'todo';
  taskError: boolean = false;

  // Clear modal
  showClearModal: boolean = false;

  ngOnInit(): void {
    this.loadFromStorage();
  }

  // ---------- Storage ----------
  saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

  loadFromStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      this.tasks = [];
      return;
    }
    try {
      this.tasks = JSON.parse(data);
    } catch {
      this.tasks = [];
    }
  }

  // ---------- Task Filtering ----------
  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  // ---------- Drag & Drop ----------
  onDragStart(event: DragEvent, task: Task): void {
    this.draggedTask = task;
    const target = event.target as HTMLElement;
    target.classList.add('dragging');
  }

  onDragEnd(event: DragEvent): void {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, newStatus: 'todo' | 'inprogress' | 'done'): void {
    event.preventDefault();

    if (!this.draggedTask) return;

    // Update task status
    this.tasks = this.tasks.map((t) =>
      t.id === this.draggedTask!.id ? { ...t, status: newStatus } : t,
    );

    this.draggedTask = null;
    this.saveToStorage();
  }

  // ---------- Add Task Modal ----------
  openTaskModal(): void {
    this.showTaskModal = true;
    this.newTaskText = '';
    this.newTaskStatus = 'todo';
    this.taskError = false;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
  }

  createTask(): void {
    const text = this.newTaskText.trim();

    if (!text) {
      this.taskError = true;
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: text,
      status: this.newTaskStatus,
    };

    this.tasks.push(newTask);
    this.saveToStorage();
    this.closeTaskModal();
  }

  // ---------- Clear Board Modal ----------
  openClearModal(): void {
    this.showClearModal = true;
  }

  closeClearModal(): void {
    this.showClearModal = false;
  }

  clearBoard(): void {
    this.tasks = [];
    this.saveToStorage();
    this.closeClearModal();
  }

  // ---------- Export Functions ----------
  async savePng(): Promise<void> {
    // Dinamički import html2canvas
    const html2canvas = (await import('html2canvas')).default;

    const element = this.kanbanPrintArea.nativeElement;
    const canvas = await html2canvas(element, { backgroundColor: '#ffffff' });
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = 'kanban-board.png';
    link.click();
  }

  exportPdf(): void {
    window.print();
  }
}
