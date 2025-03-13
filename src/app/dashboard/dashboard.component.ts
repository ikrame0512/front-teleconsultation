import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importer HttpClient et HttpHeaders
import { AuthService } from '../services/auth.service';
import { PatientDashboardComponent } from '../patient-dashboard/dashboard.component';
import { WebSocketService } from '../services/web-socket-service.service';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

interface Appointment {
  id: number;
  dateDepart: string;
  heureDepart: string;
  dateFin: string;
  heureFin: string;
  patient: string;
  status: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | string; // Garder les mêmes statuts
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    PatientDashboardComponent,
    MatPaginatorModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalAppointments = 0;
  pendingAppointments = 0;
  userRole: string = '';

  // pagination
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  appointments: Appointment[] = [];
  medecinId: number | null = null; // Ajouter une variable pour stocker l'ID du médecin

  dataSource = new MatTableDataSource(this.appointments);
  displayedColumns: string[] = [
    'dateDepart',
    'heureDepart',
    'dateFin',
    'heureFin',
    'patient',
    'status',
    'actions',
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.medecinId = this.authService.getIdFromToken();
    this.userRole = this.authService.getUserRole();
    console.log('Medecin ID in ngOnInit:', this.medecinId); // Récupérer l'ID du médecin depuis le token

    if (this.medecinId) {
      this.getAppointments(this.medecinId); // Passer medecinId à la méthode pour récupérer les rendez-vous
    } else {
      console.error('medecinId is null or undefined');
    }

    if (this.authService.isAuthenticated()) {
      this.webSocketService.connect();
    }
  }

  getAppointments(medecinId: number | null): void {
    if (!medecinId) return;
    const token = localStorage.getItem('token');
    console.log('Token dialnaa  :', token); // Récupérer le token du médecin depuis localStorage

    // Ajouter le token dans les en-têtes de la requête
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<any>(
        `http://localhost:8089/rendezvous/getAllByMedecin?medecinId=${medecinId}&page=${this.pageIndex}&size=${this.pageSize}`,
        { headers }
      )
      .subscribe((data) => {
        console.log('Data received:', data);
        this.appointments = data.content.map((item: any) => ({
          id: item.id,
          dateDepart: item.dateDepart,
          heureDepart: item.heureDepart,
          dateFin: item.dateFin,
          heureFin: item.heureFin,
          patient: item.patientName,
          status: item.statut,
        }));
        this.totalAppointments = data.totalElements;
        this.length = this.totalAppointments;
        this.pendingAppointments = this.appointments.filter(
          (app) => app.status === 'EN_ATTENTE'
        ).length;
        this.dataSource.data = [...this.appointments];
      });
  }

  acceptAppointment(id: number) {
    if (this.medecinId) {
      // Vérifier si medecinId est disponible
      this.updateAppointmentStatus(id, 'CONFIRME');
      const token = localStorage.getItem('token'); // Récupérer le token du médecin

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http
        .post(
          `http://localhost:8089/rendezvous/accepter?rendezVousId=${id}`,
          {},
          { headers }
        )
        .subscribe(() => {
          if (this.medecinId !== null) {
            // Vérifier si medecinId est un nombre
            this.getAppointments(this.medecinId); // Passer medecinId à la méthode pour récupérer les rendez-vous
          } else {
            console.error('Medecin ID is null');
          }
        });
    }
  }

  refuseAppointment(id: number) {
    if (this.medecinId) {
      // Vérifier si medecinId est disponible
      this.updateAppointmentStatus(id, 'ANNULE');
      const token = localStorage.getItem('token'); // Récupérer le token du médecin

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http
        .post(
          `http://localhost:8089/rendezvous/annuler?rendezVousId=${id}`,
          {},
          { headers }
        )
        .subscribe(() => {
          if (this.medecinId !== null) {
            // Vérifier si medecinId est un nombre
            this.getAppointments(this.medecinId); // Passer medecinId à la méthode pour récupérer les rendez-vous
          } else {
            console.error('Medecin ID is null');
          }
        });
    }
  }

  private updateAppointmentStatus(id: number, status: 'CONFIRME' | 'ANNULE') {
    const appointment = this.appointments.find((app) => app.id === id);
    if (appointment) {
      appointment.status = status;
      this.pendingAppointments = this.appointments.filter(
        (app) => app.status === 'EN_ATTENTE'
      ).length;
      this.dataSource.data = [...this.appointments];
    }
  }

  handlePageEvent(e: PageEvent) {
    // this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getAppointments(this.medecinId);
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }
}
