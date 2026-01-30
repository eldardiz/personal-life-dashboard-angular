import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModuleService } from '../../services/module.service';
import { AuthService } from '../../services/auth.service';
import { TrackerModule } from '../../models/tracker.model';

@Component({
  selector: 'app-module-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-selector.component.html',
  styleUrls: ['./module-selector.component.css'],
})
export class ModuleSelectorComponent implements OnInit {
  modules: TrackerModule[] = [];
  selectedModules: Set<string> = new Set();

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
    const currentUser = localStorage.getItem('currentUser'); // Username iz localStorage
    if (!currentUser) return [];

    const key = `${currentUser}_modules`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  private saveModulesToLocalStorage(modules: string[]): void {
    const currentUser = localStorage.getItem('currentUser'); // Username iz localStorage
    if (!currentUser) return;

    const key = `${currentUser}_modules`;
    localStorage.setItem(key, JSON.stringify(modules));

    console.log('✅ Saved modules:', modules, 'to key:', key);
  }
}
