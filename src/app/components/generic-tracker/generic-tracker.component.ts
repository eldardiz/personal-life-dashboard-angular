import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerModule, TrackerEntry } from '../../models/tracker.model';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-generic-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generic-tracker.component.html',
  styleUrls: ['./generic-tracker.component.css'],
})
export class GenericTrackerComponent implements OnInit {
  @Input() module!: TrackerModule;
  @Input() username!: string;
  @Output() close = new EventEmitter<void>();

  entries: TrackerEntry[] = [];
  newEntry: any = {
    value: '',
    notes: '',
    // Dodatna polja za različite trackere
    habitName: '',
    quality: '',
    subject: '',
    topics: '',
    exerciseType: '',
    intensity: '',
    priority: '',
    status: '',
    mealType: '',
    calories: '',
    type: '',
    category: '',
    eventDate: '',
    bookTitle: '',
  };

  showForm: boolean = false;
  editingEntry: TrackerEntry | null = null;

  moodOptions = ['😢 Sad', '😐 Neutral', '😊 Happy', '😄 Great', '🤩 Amazing'];
  habitStatus = ['✅ Done', '❌ Not Done', '⏭️ Skipped'];

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.entries = this.storageService.getTrackerEntries(
      this.username,
      this.module.id
    );
    this.entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  onClose(): void {
    this.close.emit();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newEntry = {
      value: '',
      notes: '',
      habitName: '',
      quality: '',
      subject: '',
      topics: '',
      exerciseType: '',
      intensity: '',
      priority: '',
      status: '',
      mealType: '',
      calories: '',
      type: '',
      category: '',
      eventDate: '',
      bookTitle: '',
    };
    this.editingEntry = null;
  }

  addEntry(): void {
    // Validacija prema tipu modula
    if (!this.validateEntry()) {
      alert('Please fill in all required fields!');
      return;
    }

    const entry: TrackerEntry = {
      id: this.editingEntry ? this.editingEntry.id : Date.now().toString(),
      moduleId: this.module.id,
      date: new Date(),
      value: this.newEntry,
      notes: this.newEntry.notes,
    };

    if (this.editingEntry) {
      this.storageService.updateTrackerEntry(
        this.username,
        this.module.id,
        entry.id,
        entry
      );
    } else {
      this.storageService.addTrackerEntry(this.username, this.module.id, entry);
    }

    this.loadEntries();
    this.toggleForm();
  }

  validateEntry(): boolean {
    switch (this.module.id) {
      case 'habit':
        return !!this.newEntry.habitName && !!this.newEntry.value;
      case 'water':
      case 'sleep':
      case 'finance':
        return !!this.newEntry.value;
      case 'study':
        return !!this.newEntry.subject && !!this.newEntry.value;
      case 'fitness':
        return !!this.newEntry.exerciseType && !!this.newEntry.value;
      case 'task':
        return !!this.newEntry.value;
      case 'meal':
        return !!this.newEntry.mealType && !!this.newEntry.value;
      case 'mood':
        return !!this.newEntry.value;
      case 'calendar':
        return !!this.newEntry.value;
      case 'gratitude':
      case 'reflection':
        return !!this.newEntry.value;
      case 'reading':
        return !!this.newEntry.bookTitle && !!this.newEntry.value;
      default:
        return !!this.newEntry.value;
    }
  }

  editEntry(entry: TrackerEntry): void {
    this.editingEntry = entry;
    this.newEntry = { ...entry.value, notes: entry.notes || '' };
    this.showForm = true;
  }

  deleteEntry(entryId: string): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.storageService.deleteTrackerEntry(
        this.username,
        this.module.id,
        entryId
      );
      this.loadEntries();
    }
  }

  formatEntryValue(entry: TrackerEntry): string {
    const value = entry.value;

    switch (this.module.id) {
      case 'habit':
        return `<strong>${value.habitName}</strong> - ${value.value}`;

      case 'water':
        return `💧 <strong>${value.value} glasses</strong> (${
          value.value * 250
        }ml)`;

      case 'sleep':
        const quality = value.quality ? ` - ${value.quality}` : '';
        return `😴 <strong>${value.value} hours</strong>${quality}`;

      case 'study':
        const topics = value.topics
          ? `<br><small>Topics: ${value.topics}</small>`
          : '';
        return `📚 <strong>${value.subject}</strong> - ${value.value} minutes${topics}`;

      case 'fitness':
        const intensity = value.intensity ? ` - ${value.intensity}` : '';
        return `🧘 <strong>${value.exerciseType}</strong> - ${value.value} minutes${intensity}`;

      case 'task':
        const priority = value.priority ? ` ${value.priority}` : '';
        const status = value.status ? ` - ${value.status}` : '';
        return `${priority} <strong>${value.value}</strong>${status}`;

      case 'meal':
        const calories = value.calories ? ` (${value.calories} kcal)` : '';
        return `${value.mealType}<br><strong>${value.value}</strong>${calories}`;

      case 'finance':
        const type = value.type || '💰';
        const category = value.category ? ` - ${value.category}` : '';
        return `${type} <strong>${value.value} €</strong>${category}`;

      case 'calendar':
        const eventDate = value.eventDate
          ? `<br><small>${new Date(value.eventDate).toLocaleString()}</small>`
          : '';
        return `📅 <strong>${value.value}</strong>${eventDate}`;

      case 'reading':
        return `📖 <strong>${value.bookTitle}</strong><br>${value.value} pages`;

      case 'mood':
        return `${value.value}`;

      case 'gratitude':
      case 'reflection':
        return `${value.value}`;

      default:
        return value.value || value;
    }
  }

  getStreakDays(): number {
    if (this.entries.length === 0) return 0;

    let streak = 1;
    const sortedDates = this.entries.map((e) =>
      new Date(e.date).toDateString()
    );
    const uniqueDates = [...new Set(sortedDates)].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      const diffDays = Math.floor(
        (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
