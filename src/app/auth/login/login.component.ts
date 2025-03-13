import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'; // Ajout de ReactiveFormsModule
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Correction de 'styleUrl' à 'styleUrls'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          console.log('Token reçu:', response);
          // Convertir la réponse en chaîne JSON et la stocker dans le localStorage
          localStorage.setItem('token', JSON.stringify(response));
          this.router.navigate(['/dashboard']); // Redirige vers le tableau de bord après connexion
        },
        (error) => {
          console.error('Erreur de connexion:', error);
        }
      );
      // Réinitialiser les champs du formulaire après soumission
      this.loginForm.reset();
    }
  }
}
