import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'personal-life-dashboard';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Učitaj temu pri pokretanju app-a
    this.themeService.loadTheme();
  }
}
