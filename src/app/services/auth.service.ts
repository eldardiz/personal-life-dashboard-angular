import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { User } from '../models/tracker.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private storageService: StorageService, private router: Router) {}

  register(
    username: string,
    email: string,
    password: string,
    theme: string
  ): boolean {
    // Proveri da li korisnik već postoji
    const existingUsers = this.storageService.getItem('users') || [];
    const userExists = existingUsers.find(
      (u: User) => u.username === username || u.email === email
    );

    if (userExists) {
      return false;
    }

    // Kreiraj novog korisnika
    const newUser: User = {
      username,
      email,
      password, // U realnoj app bi se hashovala!
      theme,
      selectedModules: [],
    };

    existingUsers.push(newUser);
    this.storageService.setItem('users', existingUsers);
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.storageService.getItem('users') || [];
    const user = users.find(
      (u: User) =>
        (u.username === username || u.email === username) &&
        u.password === password
    );

    if (user) {
      this.storageService.setCurrentUser(user.username);
      return true;
    }
    return false;
  }

  logout(): void {
    this.storageService.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.storageService.getCurrentUser() !== null;
  }

  getCurrentUser(): string | null {
    return this.storageService.getCurrentUser();
  }

  getUserData(username: string): User | null {
    const users = this.storageService.getItem('users') || [];
    return users.find((u: User) => u.username === username) || null;
  }

  updateUserTheme(username: string, theme: string): void {
    const users = this.storageService.getItem('users') || [];
    const userIndex = users.findIndex((u: User) => u.username === username);

    if (userIndex !== -1) {
      users[userIndex].theme = theme;
      this.storageService.setItem('users', users);
    }
  }
}
