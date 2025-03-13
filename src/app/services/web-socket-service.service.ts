import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Client;
  brokerURL = 'http://localhost:8089/ws'; // Point d'entrée WebSocket

  userRole: string = '';

  constructor(private authService: AuthService, private taostr: ToastrService) {
    this.userRole = this.authService.getUserRole();
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.brokerURL),
      connectHeaders: {
        'auth-token': JSON.parse(localStorage.getItem('token')!).token!,
      },
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        console.log('Connecté au serveur WebSocket');
        if (this.userRole === 'MEDECIN') {
          this.stompClient.subscribe(`/topic/rendezvous`, (message) => {
            console.log('Message reçu:', message.body);
            this.taostr.info(message.body);
          });
        }
        if (this.userRole === 'PATIENT') {
          this.stompClient.subscribe(
            `/topic/rendezvous/accepter`,
            (message) => {
              console.log('Message reçu:', message.body);
              this.taostr.info(message.body);
            }
          );
          this.stompClient.subscribe(`/topic/rendezvous/annuler`, (message) => {
            console.log('Message reçu:', message.body);
            this.taostr.error(message.body);
          });
        }
        // S'abonner à un topic pour recevoir des notifications en temps réel
        // this.stompClient.subscribe(`/user/queue/rendezvous`, (message) => {
        //   console.log('Message reçu:', message.body);
        //   // Afficher ou traiter la notification
        // });
      },
    });
  }

  connect() {
    this.stompClient.activate();
  }

  disconnect() {
    this.stompClient.deactivate();
  }
}
