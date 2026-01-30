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
  themes: any[] = [];

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.themes = this.themeService.getThemes();
  }

  onThemeChange(themeId: string): void {
    this.selectedTheme = themeId;
    this.themeService.setTheme(themeId);
  }

  onRegister(): void {
    // Validacija
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    if (this.password.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters!';
      return;
    }

    // Registruj korisnika
    const success = this.authService.register(
      this.username,
      this.email,
      this.password,
      this.selectedTheme
    );

    if (success) {
      // Automatski login nakon registracije
      this.authService.login(this.username, this.password);
      this.router.navigate(['/module-selector']);
    } else {
      this.errorMessage = 'Username or email already exists!';
    }
  }
}
