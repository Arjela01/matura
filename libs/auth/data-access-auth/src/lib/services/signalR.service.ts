import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { NotificationEnum } from '@msh/shared/domain-models';
import { environment } from '@msh/shared/environments';
import { Observable, Subject } from 'rxjs';
import { StorageService } from '@msh/shared/data-access-shared';
import { TOKEN_STORAGE_KEY } from './token.interceptor';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private readonly hubConnection: signalR.HubConnection;
  private messageReceived$ = new Subject<{
    notificationEnum: NotificationEnum;
    data: any;
  }>();
  constructor(private storageService: StorageService) {
    const hubUrl = `${environment.api_url}/maturaHub`;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => this.getAccessToken(),
      })
      .configureLogging(signalR.LogLevel.Error)
      .build();
  }
  public startConnection() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection established.');
        this.registerHubEvents();
      })
      .catch(err => {
        console.error('Error while starting SignalR connection:', err);
        setTimeout(() => {
          this.startConnection();
        }, 5000);
      });
  }
  public registerHubEvents() {
    if (this.hubConnection) {
      this.hubConnection.on(
        'SendNotificationAsync',
        (notificationEnum: NotificationEnum, data: any) => {
          this.messageReceived$.next({ notificationEnum, data });
        }
      );
    }
  }
  public getMessageReceivedObservable(): Observable<{
    notificationEnum: NotificationEnum;
    data: any;
  }> {
    return this.messageReceived$.asObservable();
  }
  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  private getAccessToken(): string {
    const token = this.storageService.getItem(TOKEN_STORAGE_KEY) as string;
    return token || '';
  }
}
