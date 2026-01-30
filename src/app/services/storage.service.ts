import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // Generičke metode za rad sa localStorage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  // Specifične metode za korisnika
  getCurrentUser(): string | null {
    return localStorage.getItem('currentUser');
  }

  setCurrentUser(username: string): void {
    localStorage.setItem('currentUser', username);
  }

  // Metode za module
  getUserModules(username: string): string[] {
    const modules = this.getItem(`${username}_modules`);
    return modules || [];
  }

  setUserModules(username: string, modules: string[]): void {
    this.setItem(`${username}_modules`, modules);
  }

  // Metode za tracker entries
  getTrackerEntries(username: string, moduleId: string): any[] {
    const entries = this.getItem(`${username}_${moduleId}_entries`);
    return entries || [];
  }

  addTrackerEntry(username: string, moduleId: string, entry: any): void {
    const entries = this.getTrackerEntries(username, moduleId);
    entries.push(entry);
    this.setItem(`${username}_${moduleId}_entries`, entries);
  }

  updateTrackerEntry(
    username: string,
    moduleId: string,
    entryId: string,
    updatedEntry: any
  ): void {
    let entries = this.getTrackerEntries(username, moduleId);
    entries = entries.map((e) => (e.id === entryId ? updatedEntry : e));
    this.setItem(`${username}_${moduleId}_entries`, entries);
  }

  deleteTrackerEntry(
    username: string,
    moduleId: string,
    entryId: string
  ): void {
    let entries = this.getTrackerEntries(username, moduleId);
    entries = entries.filter((e) => e.id !== entryId);
    this.setItem(`${username}_${moduleId}_entries`, entries);
  }
}
