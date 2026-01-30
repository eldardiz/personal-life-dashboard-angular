import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
    private moduleService: ModuleService,
    private themeService: ThemeService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    // Provjera logina
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = user;

    // Učitaj user podatke iz Firebase
    await this.loadUserData();

    // Učitaj teme
    this.themes = this.themeService.getThemes();
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  async loadUserData(): Promise<void> {
    const userData = await this.authService.getUserData();

    if (userData) {
      // Primijeni temu iz Firebase
      if (userData.theme) {
        this.themeService.setTheme(userData.theme);
        this.currentTheme = userData.theme;
      }
    }

    // Učitaj module iz localStorage (ne iz Firebase)
    const selectedIds = this.getSelectedModulesFromLocalStorage();
    this.enabledModules = selectedIds
      .map((id) => this.moduleService.getModuleById(id))
      .filter((m) => m !== undefined) as TrackerModule[];
  }

  private getSelectedModulesFromLocalStorage(): string[] {
    // Koristi username iz localStorage umjesto email-a iz Firebase
    const currentUser = localStorage.getItem('currentUser'); // ← Direktno iz localStorage
    if (!currentUser) return [];

    const key = `${currentUser}_modules`; // ← Format: "test_modules"
    const stored = localStorage.getItem(key);

    console.log('🔍 Current user:', currentUser);
    console.log('🔑 Looking for key:', key);
    console.log('📦 Found data:', stored);

    return stored ? JSON.parse(stored) : [];
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

  async changeTheme(themeId: string): Promise<void> {
    this.themeService.setTheme(themeId);
    await this.authService.updateUserTheme(themeId); // ← POPRAVLJEN - samo 1 argument
    this.currentTheme = themeId;
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
