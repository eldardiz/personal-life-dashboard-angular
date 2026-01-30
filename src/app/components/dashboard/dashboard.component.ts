import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { ModuleService } from '../../services/module.service';
import { ThemeService } from '../../services/theme.service';
import { TrackerModule } from '../../models/tracker.model';
import { GenericTrackerComponent } from '../generic-tracker/generic-tracker.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GenericTrackerComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  username: string = '';
  enabledModules: TrackerModule[] = [];
  selectedModule: TrackerModule | null = null;
  currentDate: Date = new Date();
  showThemeSelector: boolean = false;
  themes: any[] = [];
  currentTheme: string = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private moduleService: ModuleService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = user;
    this.loadEnabledModules();
    this.themes = this.themeService.getThemes();
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  loadEnabledModules(): void {
    const selectedIds = this.storageService.getUserModules(this.username);
    this.enabledModules = selectedIds
      .map((id) => this.moduleService.getModuleById(id))
      .filter((m) => m !== undefined) as TrackerModule[];
  }

  openModule(module: TrackerModule): void {
    this.selectedModule = module;
  }

  closeModule(): void {
    this.selectedModule = null;
  }

  editModules(): void {
    this.router.navigate(['/module-selector']);
  }

  toggleThemeSelector(): void {
    this.showThemeSelector = !this.showThemeSelector;
  }

  changeTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
    this.authService.updateUserTheme(this.username, themeId);
    this.currentTheme = themeId;
  }

  logout(): void {
    this.authService.logout();
  }
}
