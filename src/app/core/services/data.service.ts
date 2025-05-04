import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Company } from '../models/company.model';
import { Department } from '../models/department.model';
import { Board } from '../models/board.model';
import { User } from '../models/user.model';
import { NotificationSettings } from '../models/notification-settings.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private companies: Company[] = [
    { id: '1', name: 'Acme Corp' }
  ];

  private departments: Department[] = [
    { id: '1', name: 'Sales', companyId: '1' },
    { id: '2', name: 'Marketing', companyId: '1' }
  ];

  private boards: Board[] = [
    { id: '1', name: 'Sales Board', departmentId: '1' },
    { id: '2', name: 'Marketing Board', departmentId: '2' }
  ];

  private users: User[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' }
  ];

  private notificationSettings: NotificationSettings = {
    id: '1',
    emailNotificationsEnabled: true,
    pushNotificationsEnabled: false,
    telegramNotificationsEnabled: true
  }

  constructor() { }

  getCompanies(): Observable<Company[]> {
    return of(this.companies);
  }

  getDepartments(companyId: string): Observable<Department[]> {
    return of(this.departments.filter(d => d.companyId === companyId));
  }

  getBoards(departmentId: string): Observable<Board[]> {
    return of(this.boards.filter(b => b.departmentId === departmentId));
  }

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getNotificationSettings(): Observable<NotificationSettings> {
    return of(this.notificationSettings);
  }
}