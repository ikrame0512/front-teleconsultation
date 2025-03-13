import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/login`, credentials);
  }

  register(data: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, data);
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }
  // Fonction pour obtenir l'ID du médecin depuis le token
  getIdFromToken(): number | null {
    const token = localStorage.getItem('token'); // Récupérer le token du localStorage
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log(decodedToken); // Décoder le token
        if (decodedToken && decodedToken.id) {
          return decodedToken.id; // Retourner l'ID du médecin
        } else {
          console.error('ID du médecin introuvable dans le token');
          return null;
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token', error);
        return null;
      }
    }
    return null;
  }

  // Fonction pour obtenir l'ID du médecin depuis le token
  getEmailFromToken(): number | null {
    const token = localStorage.getItem('token'); // Récupérer le token du localStorage
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log(decodedToken); // Décoder le token
        if (decodedToken && decodedToken.sub) {
          return decodedToken.sub; // Retourner l'ID du médecin
        } else {
          console.error('ID du médecin introuvable dans le token');
          return null;
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token', error);
        return null;
      }
    }
    return null;
  }

  private getToken() {
    return localStorage.getItem('token');
  }
  getUserRole() {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decodedPayload: any = jwtDecode(token);
    console.log(decodedPayload.role);
    console.log(decodedPayload);
    return decodedPayload.role;
  }

  // Déconnecte l'utilisateur
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
