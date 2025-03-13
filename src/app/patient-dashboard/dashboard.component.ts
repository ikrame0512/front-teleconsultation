import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NewAppointmentFormComponent } from '../new-appoitnment-form/new-appointment-form.component';

interface Appointment {
  id: number;
  date: string;
  patient: string;
  status: 'pending' | 'accepted' | 'refused' | string;
}
@Component({
  selector: 'app-patient-dashboard',
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
    NewAppointmentFormComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class PatientDashboardComponent implements OnInit {
  totalAppointments = 10;
  pendingAppointments = 4;
  userRole: string = '';
  doctors = ['imane'];
  currentDate = new Date();

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.userRole = this.authService.getUserRole();
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
    // implement get all appointments here for patients here
  }
  appointments: Appointment[] = [
    { id: 101, date: '2025-03-12', patient: 'John Doe', status: 'EN_ATTENTE' },
    { id: 102, date: '2025-03-13', patient: 'Jane Smith', status: 'EN_ATTENTE' },
    { id: 103, date: '2025-03-14', patient: 'Alice Brown', status: 'CONFIRME' },
    {
      id: 104,
      date: '2025-03-15',
      patient: 'Charlie Green',
      status: 'ANNULE',
    },
  ];

  dataSource = new MatTableDataSource(this.appointments);
  displayedColumns: string[] = ['id', 'date', 'patient', 'status'];
}
