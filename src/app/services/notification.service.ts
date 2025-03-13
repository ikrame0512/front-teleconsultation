import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: any;
  private notificationSubject = new Subject<string>();

  constructor() {
    this.socket = io('http://localhost:8089'); // URL du backend
    this.socket.on('notification', (message: string) => {
      this.notificationSubject.next(message);
    });
  }

  getNotifications() {
    return this.notificationSubject.asObservable();
  }
}
