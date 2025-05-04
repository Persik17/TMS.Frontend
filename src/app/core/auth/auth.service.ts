import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Subject для хранения информации о том, залогинен ли пользователь
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  // Subject для хранения информации о текущем пользователе
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // При инициализации сервиса, попробуем восстановить состояние из localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedInSubject.next(true);
      // В реальном приложении, здесь нужно получить информацию о пользователе по токену
      this.currentUserSubject.next({ name: 'Test User' });
    }
  }

  login(username: string, password: string): Observable<boolean> {
    // В реальном приложении, здесь будет запрос к серверу для аутентификации
    // Но в нашем случае, мы просто имитируем успешную аутентификацию
    if (username === 'test' && password === 'test') {
      // Сохраняем токен в localStorage
      localStorage.setItem('token', 'test-token');

      this.isLoggedInSubject.next(true);

      // В реальном приложении, здесь нужно получить информацию о пользователе по токену
      this.currentUserSubject.next({ name: 'Test User' });
      return of(true); // Возвращаем true, если аутентификация успешна
    } else {
      return of(false); // Возвращаем false, если аутентификация не удалась
    }
  }

  logout(): void {
    // Удаляем токен из localStorage
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    // Проверяем, есть ли токен в localStorage
    return !!localStorage.getItem('token');
  }
}