export enum FormMode {
  Add,
  Edit,
}

export interface MaturaNotificationStatus {
  id?: number;
  displayText?: NotificationEnum;
}

export enum NotificationEnum {
  MaturaNotification = 1,
  EalbaniaNotification = 2,
  DiplomaNotification = 3
}