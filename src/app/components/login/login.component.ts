import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = ''; // Promijenio username → email
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false; // Loading state za UX

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Učitaj sačuvanu temu
    this.themeService.loadTheme();
  }

  async onLogin(): Promise<void> {
    // Reset error
    this.errorMessage = '';
    this.isLoading = true;

    try {
      // Firebase login (async)
      const result = await this.authService.login(this.email, this.password);

      if (result.success) {
        // Učitaj korisnikovu temu iz Firestore
        const userData = await this.authService.getUserData();
        if (userData && userData.theme) {
          this.themeService.setTheme(userData.theme);
        }

        // Navigacija na dashboard
        this.router.navigate(['/module-selector']);
      } else {
        this.errorMessage = result.message || 'Login failed!';
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred.';
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
