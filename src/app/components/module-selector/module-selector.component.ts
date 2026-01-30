import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModuleService } from '../../services/module.service';
import { StorageService } from '../../services/storage.service';
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
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modules = this.moduleService.getAllModules();

    const username = this.authService.getCurrentUser();
    if (username) {
      const saved = this.storageService.getUserModules(username);
      this.selectedModules = new Set(saved);
    }
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
    const username = this.authService.getCurrentUser();
    if (username) {
      this.storageService.setUserModules(
        username,
        Array.from(this.selectedModules)
      );
      this.router.navigate(['/dashboard']);
    }
  }
}
