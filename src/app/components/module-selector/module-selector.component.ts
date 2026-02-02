import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // ← Dodaj RouterModule!
import { ModuleService } from '../../services/module.service';
import { AuthService } from '../../services/auth.service';
import { TrackerModule } from '../../models/tracker.model';

// Interface za Fun Zone module
interface FunZoneModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

@Component({
  selector: 'app-module-selector',
  standalone: true,
  imports: [CommonModule, RouterModule], // ← RouterModule dodat!
  templateUrl: './module-selector.component.html',
  styleUrls: ['./module-selector.component.css'],
})
export class ModuleSelectorComponent implements OnInit {
  modules: TrackerModule[] = [];
  selectedModules: Set<string> = new Set();

  // ========== FUN ZONE MODULI ==========
  funZoneModules: FunZoneModule[] = [
    {
      id: 'bingo',
      name: 'Bingo',
      description: 'Zabavna bingo igra za studente',
      icon: '🎲',
      color: '#FF6B9D',
      route: '/modules/bingo',
    },
    {
      id: 'quiz',
      name: 'Kviz',
      description: 'Testiraj svoje znanje',
      icon: '❓',
      color: '#4ECFAA',
      route: '/modules/quiz',
    },
    {
      id: 'kanban',
      name: 'Kanban Board',
      description: 'Organizuj zadatke',
      icon: '📋',
      color: '#95E1D3',
      route: '/modules/kanban-board',
    },
    {
      id: 'whiteboard',
      name: 'Whiteboard',
      description: 'Digitalna ploča za crtanje',
      icon: '✏️',
      color: '#A8E6CF',
      route: '/modules/whiteboard',
    },
    {
      id: 'vision-board',
      name: 'Vision Board',
      description: 'Kreiraj svoju inspirativnu ploču',
      icon: '📌',
      color: '#FFD3B6',
      route: '/modules/vision-board',
    },
  ];

  constructor(
    private moduleService: ModuleService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.modules = this.moduleService.getAllModules();

    // Učitaj sačuvane module iz localStorage
    const saved = this.getSavedModulesFromLocalStorage();
    this.selectedModules = new Set(saved);
  }

  toggleModule(moduleId: string): void {
    if (this.selectedModules.has(moduleId)) {
      this.selectedModules.delete(moduleId);
    } else {
      this.selectedModules.add(moduleId);
    }
  }

  isSelected(moduleId: string): boolean {
    return this.selectedModules.has(moduleId);
  }

  saveAndContinue(): void {
    // Sačuvaj module u localStorage (username format)
    this.saveModulesToLocalStorage(Array.from(this.selectedModules));
    this.router.navigate(['/dashboard']);
  }

  // Helper metode za localStorage
  private getSavedModulesFromLocalStorage(): string[] {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return [];

    const key = `${currentUser}_modules`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  private saveModulesToLocalStorage(modules: string[]): void {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const key = `${currentUser}_modules`;
    localStorage.setItem(key, JSON.stringify(modules));

    console.log('✅ Saved modules:', modules, 'to key:', key);
  }
}
