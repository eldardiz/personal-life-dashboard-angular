import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themes = [
    {
      id: 'green',
      name: '🟢 Green',
      primary: '#27ae60',
      secondary: '#2ecc71',
      background: '#e8f8f5',
    },
    {
      id: 'blue',
      name: '🔵 Blue',
      primary: '#3498db',
      secondary: '#5dade2',
      background: '#ebf5fb',
    },
    {
      id: 'pink',
      name: '🩷 Pink',
      primary: '#e91e63',
      secondary: '#f48fb1',
      background: '#fce4ec',
    },
    {
      id: 'orange',
      name: '🟠 Orange',
      primary: '#e67e22',
      secondary: '#f39c12',
      background: '#fef5e7',
    },
    {
      id: 'dark',
      name: '⚫ Dark',
      primary: '#2c3e50',
      secondary: '#34495e',
      background: '#1a1a1a',
    },
    {
      id: 'cyberpunk',
      name: '💜 Cyberpunk',
      primary: '#9b59b6',
      secondary: '#ff00ff',
      background: '#0a0a0a',
    },
  ];

  constructor() {
    this.loadTheme();
  }

  getThemes() {
    return this.themes;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find((t) => t.id === themeId);
    if (theme) {
      document.documentElement.style.setProperty(
        '--primary-color',
        theme.primary
      );
      document.documentElement.style.setProperty(
        '--secondary-color',
        theme.secondary
      );
      document.documentElement.style.setProperty(
        '--background-color',
        theme.background
      );

      // Specijalnosti za dark i cyberpunk
      if (themeId === 'dark' || themeId === 'cyberpunk') {
        document.documentElement.style.setProperty('--text-color', '#ffffff');
        document.documentElement.style.setProperty('--card-bg', '#2c3e50');
        document.documentElement.style.setProperty('--input-bg', '#34495e');
      } else {
        document.documentElement.style.setProperty('--text-color', '#2c3e50');
        document.documentElement.style.setProperty('--card-bg', '#ffffff');
        document.documentElement.style.setProperty('--input-bg', '#ffffff');
      }

      localStorage.setItem('selectedTheme', themeId);
    }
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('selectedTheme') || 'blue';
    this.setTheme(savedTheme);
  }

  getCurrentTheme(): string {
    return localStorage.getItem('selectedTheme') || 'blue';
  }
}
