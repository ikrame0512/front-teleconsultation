import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Ajout de ReactiveFormsModule
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  // standalone: true,
  // imports: [ReactiveFormsModule],  // Ajoutez ReactiveFormsModule ici
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // Correction de 'styleUrl' à 'styleUrls'
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  registerPending = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['PATIENT', [Validators.required]],
    });
  }

  onRegister(): void {
    console.log('form value: ', this.registerForm.value);
    if (this.registerForm.valid) {
      this.registerPending = true;
      this.authService
        .register(this.registerForm.value)
        .pipe(
          finalize(() => {
            setTimeout(() => {
              this.registerPending = false;
            }, 1000);
          })
        )
        .subscribe(
          (response) => {
            console.log('Utilisateur créé:', response);
            this.router.navigate(['/']);
          },
          (error) => {
            console.error("Erreur d'inscription:", error);
          }
        );
      // Réinitialiser les champs du formulaire après soumission
      this.registerForm.reset();
    }
  }
}
