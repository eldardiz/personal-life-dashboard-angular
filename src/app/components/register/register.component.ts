import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  selectedTheme: string = 'blue';
  errorMessage: string = '';
  isLoading: boolean = false; // Loading state
  themes: any[] = [];

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.themes = this.themeService.getThemes();
  }

  onThemeChange(themeId: string): void {
    this.selectedTheme = themeId;
    this.themeService.setTheme(themeId);
  }

  async onRegister(): Promise<void> {
    // Reset error
    this.errorMessage = '';

    // Validacija
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters!';
      return;
    }

    this.isLoading = true;

    try {
      // Firebase registracija (async)
      const result = await this.authService.register(
        this.username,
        this.email,
        this.password,
        this.selectedTheme,
      );

      if (result.success) {
        // Automatski login nakon registracije
        const loginResult = await this.authService.login(
          this.email,
          this.password,
        );

        if (loginResult.success) {
          this.router.navigate(['/module-selector']);
        } else {
          this.errorMessage = 'Registration successful, but login failed.';
        }
      } else {
        this.errorMessage = result.message || 'Registration failed!';
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred.';
      console.error('Registration error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
