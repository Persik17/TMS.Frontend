import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Пускает только неавторизованных пользователей.
 * Авторизованных редиректит на /profile (или другую приватную страницу).
 */
export const guestGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return true;
  }
  const router = inject(Router);
  return router.createUrlTree(['/profile']);
};
