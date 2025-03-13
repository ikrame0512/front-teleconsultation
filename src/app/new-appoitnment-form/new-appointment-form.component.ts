import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  parse,
  isBefore,
  isValid,
  differenceInMinutes,
  format,
} from 'date-fns';
import { debounceTime } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-appointment-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    SidebarComponent,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatDatepickerModule,
    MatAutocompleteModule,
  ],
  templateUrl: './new-appointment-form.component.html',
  styleUrl: './new-appointment-form.component.css',
})
export class NewAppointmentFormComponent implements OnInit {
  newAppointmentForm: FormGroup;
  userRole: string = '';
  doctors: any[] = [];
  currentDate = new Date();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.userRole = this.authService.getUserRole();
    this.newAppointmentForm = this.fb.group(
      {
        startDate: [null, Validators.required],
        startTime: ['', [Validators.required, this.timeFormatValidator]],
        endDate: [null, Validators.required],
        endTime: ['', [Validators.required, this.timeFormatValidator]],
        doctor: [''],
      },
      { validators: this.durationValidator }
    );
  }

  // Custom time format validator (HH:mm)
  timeFormatValidator(control: AbstractControl) {
    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!control.value || timePattern.test(control.value)) {
      return null;
    }
    return { invalidTimeFormat: true };
  }
  ngOnInit(): void {
    // Listen for changes in the date/time fields
    this.newAppointmentForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        if (this.newAppointmentForm.valid) {
          this.fetchDoctors();
        } else {
          this.doctors = []; // Clear the doctors list if invalid
        }
      });
  }

  onAddNewAppointment() {
    const mappedData = this.mapToCreateAppointmentDto(
      this.newAppointmentForm.value
    );
    console.log('mapped data: ', mappedData);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http
      .post('http://localhost:8089/rendezvous/prendre', mappedData, { headers })
      .subscribe((res) => {
        this.toastr.success('Votre rendez vous est pris avec success');
        this.newAppointmentForm.reset();
      });

    // save new appoiment api call with mappedData
  }

  // map form data to dto
  mapToCreateAppointmentDto(formData: any) {
    const [startHours, startMinutes] = formData.startTime
      .split(':')
      .map(Number);
    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);

    const startDateTime = new Date(formData.startDate);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(formData.endDate);
    endDateTime.setHours(endHours, endMinutes, 0, 0);
    return {
      dateDepart: startDateTime.toISOString().replace('Z', ''),
      dateFin: endDateTime.toISOString().replace('Z', ''),
      medecinId: formData.doctor?.id,
      patientId: this.authService.getIdFromToken(), //  add patient id from token
    };
  }

  // Custom validator to check the duration of the appointment (max 2 hours)
  durationValidator(group: FormGroup) {
    const startDate: Date = group.get('startDate')?.value;
    const startTime: string = group.get('startTime')?.value;
    const endDate: Date = group.get('endDate')?.value;
    const endTime: string = group.get('endTime')?.value;

    if (!startDate || !startTime || !endDate || !endTime) {
      return null;
    }

    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      return { invalidDateTime: true };
    }

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(endDate);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    if (!isValid(startDateTime) || !isValid(endDateTime)) {
      return { invalidDateTime: true };
    }

    if (!isBefore(startDateTime, endDateTime)) {
      return { dateRangeInvalid: true };
    }

    if (differenceInMinutes(endDateTime, startDateTime) > 120) {
      return { durationExceeded: true };
    }

    return null;
  }

  // doctors
  fetchDoctors() {
    const token = localStorage.getItem('token');
    console.log('Token dialnaa  :', token); // Récupérer le token du médecin depuis localStorage

    // Ajouter le token dans les en-têtes de la requête
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const startDate: Date = this.newAppointmentForm.get('startDate')?.value;
    const startTime: string = this.newAppointmentForm.get('startTime')?.value;
    const endDate: Date = this.newAppointmentForm.get('endDate')?.value;
    const endTime: string = this.newAppointmentForm.get('endTime')?.value;

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(endDate);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    this.http
      .get<any>(
        `http://localhost:8089/medecin/disponibles?dateDepart=${startDateTime
          .toISOString()
          .replace('Z', '')}&dateFin=${endDateTime
          .toISOString()
          .replace('Z', '')}`,
        { headers }
      )
      .subscribe((data) => {
        console.log('Data received:', data);
        this.doctors = data.map((item: any) => {
          const user = item.utilisateur;
          return {
            id: item.id,
            nom: user.nom,
          };
        });
      });
  }

  loadMoreDoctors(event: Event) {
    event.stopPropagation(); // Prevent dropdown from closing
    // this.page++; // Increment page
    // this.doctorService.getDoctors(this.doctorControl.value, this.page).subscribe((response: any) => {
    //   this.doctors = [...this.doctors, ...response.data]; // Append new data
    //   this.hasMore = response.hasMore;
    // });
  }

  selectDoctor(event: any) {
    console.log('Selected Doctor ID:', event);
  }
  displayName(selected: any) {
    return selected?.nom;
  }
}
