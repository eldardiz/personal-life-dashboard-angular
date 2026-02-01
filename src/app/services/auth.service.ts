import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User as FirebaseUser,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/tracker.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  // Observable za praćenje auth stanja
  user$: Observable<FirebaseUser | null> = user(this.auth);
  currentUser: FirebaseUser | null = null;

  constructor() {
    // Prati promjene u auth stanju
    this.user$.subscribe((firebaseUser) => {
      this.currentUser = firebaseUser;
    });
  }

  /**
   * Registracija novog korisnika
   */
  async register(
    username: string,
    email: string,
    password: string,
    theme: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // 1. Kreiraj Firebase Auth nalog
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      // 2. Sačuvaj dodatne podatke u Firestore
      const userData: User = {
        username,
        email,
        password: '', // NE čuvamo password u Firestore!
        theme,
        selectedModules: [],
      };

      await setDoc(
        doc(this.firestore, 'users', userCredential.user.uid),
        userData,
      );

      // 🔥 DODAJ OVE 2 LINIJE:
      localStorage.setItem('currentUser', username);
      localStorage.setItem('userEmail', email);

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);

      let message = 'Registration failed.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email is already in use.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }

      return { success: false, message };
    }
  }

  /**
   * Login korisnika
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      // Učitaj user podatke iz Firestore
      const userDoc = await getDoc(
        doc(this.firestore, 'users', userCredential.user.uid),
      );

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;

        // 🔥 DODAJ OVE 2 LINIJE:
        localStorage.setItem('currentUser', userData.username);
        localStorage.setItem('userEmail', userData.email);

        console.log('User logged in:', userData);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);

      let message = 'Login failed.';
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Try again later.';
      }

      return { success: false, message };
    }
  }

  /**
   * Logout korisnika
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Provjera da li je korisnik ulogovan
   */
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Dobij trenutnog korisnika (email)
   */
  getCurrentUser(): string | null {
    return this.currentUser?.email || null;
  }

  /**
   * Dobij UID trenutnog korisnika
   */
  getCurrentUserId(): string | null {
    return this.currentUser?.uid || null;
  }

  /**
   * Učitaj user podatke iz Firestore
   */
  /**
   * Učitaj user podatke iz Firestore
   */
  async getUserData(): Promise<User | null> {
    const uid = this.getCurrentUserId();
    if (!uid) return null;

    try {
      // Popravljeno: pozivamo getDoc direktno sa doc referencom
      const userDocRef = doc(this.firestore, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Ažuriraj temu korisnika
   */
  async updateUserTheme(theme: string): Promise<void> {
    const uid = this.getCurrentUserId();
    if (!uid) return;

    try {
      await updateDoc(doc(this.firestore, 'users', uid), { theme });
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }

  /**
   * Ažuriraj selectedModules korisnika
   */
  async updateSelectedModules(modules: string[]): Promise<void> {
    const uid = this.getCurrentUserId();
    if (!uid) return;

    try {
      await updateDoc(doc(this.firestore, 'users', uid), {
        selectedModules: modules,
      });
    } catch (error) {
      console.error('Error updating modules:', error);
    }
  }

  /**
   * Dobij username trenutnog korisnika
   */
  async getCurrentUsername(): Promise<string | null> {
    const userData = await this.getUserData();
    return userData?.username || null;
  }
}
