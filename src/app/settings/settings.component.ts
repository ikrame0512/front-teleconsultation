import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

interface Appointment {
  id: number;
  date: string;
  patient: string;
  status: 'pending' | 'accepted' | 'refused' | string;
}
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  user = {
    name: 'Dr. Smith',
    email: 'dr.smith@example.com',
  };

  ngOnInit(): void {
    // implement get all appointments here.
  }
  saveProfile() {
    // Logic to save the changes (you can integrate a service here for API calls)
    console.log('Settings saved:', {
      name: this.user.name,
      email: this.user.email,
    });
  }
}
