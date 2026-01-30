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
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Učitaj sačuvanu temu
    this.themeService.loadTheme();
  }

  onLogin(): void {
    if (this.authService.login(this.username, this.password)) {
      // Učitaj korisnikovu temu
      const userData = this.authService.getUserData(this.username);
      if (userData && userData.theme) {
        this.themeService.setTheme(userData.theme);
      }
      this.router.navigate(['/module-selector']);
    } else {
      this.errorMessage = 'Invalid username or password!';
    }
  }
}
