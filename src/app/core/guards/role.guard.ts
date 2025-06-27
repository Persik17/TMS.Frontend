import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Проверяет, есть ли у пользователя нужная роль для доступа к маршруту.
 * Ожидает, что роли пользователя лежат в localStorage как строка-массив: ["user","admin"]
 * В маршруте указывается data: { roles: ['admin', 'moderator'] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  const userRoles = JSON.parse(
    localStorage.getItem('roles') ?? '[]'
  ) as string[];
  if (allowedRoles && userRoles.some((role) => allowedRoles.includes(role))) {
    return true;
  }
  const router = inject(Router);
  return router.createUrlTree(['/login']);
};
