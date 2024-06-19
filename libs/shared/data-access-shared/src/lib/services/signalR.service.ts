import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '@msh/shared/environments';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private readonly hubConnection: signalR.HubConnection;
  private messageReceived$ = new Subject<{
    notificationEnum: any;
    data: any;
  }>();
  constructor() {
    const hubUrl = `${environment.api_url}/maturaHub`;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this.startConnection();
  }
  public startConnection() {
    this.hubConnection.start().then(() => {
      this.registerHubEvents();
    });
  }
  public registerHubEvents() {
    if (this.hubConnection) {
      this.hubConnection.on(
        'SendNotificationAsync',
        (notificationEnum: any, data: any) => {
          this.messageReceived$.next({ notificationEnum, data });
        }
      );
    }
  }
  public getMessageReceivedObservable(): Observable<{
    notificationEnum: any;
    data: any;
  }> {
    return this.messageReceived$.asObservable();
  }
  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
