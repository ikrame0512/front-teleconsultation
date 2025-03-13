import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Assurez-vous que le chemin est correct

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // L'utilisateur est authentifié, autoriser l'accès
  } else {
    // L'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    return router.createUrlTree(['/']);
  }
};
