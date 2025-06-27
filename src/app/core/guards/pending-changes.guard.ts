import { CanDeactivateFn } from '@angular/router';

/**
 * Работает с компонентами, в которых есть метод hasPendingChanges(): boolean.
 * Если есть несохранённые изменения — запрашивает подтверждение.
 */
export interface CanComponentDeactivate {
  hasPendingChanges: () => boolean;
}

export const pendingChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component
) => {
  if (component.hasPendingChanges && component.hasPendingChanges()) {
    return window.confirm(
      'У вас есть несохранённые изменения. Покинуть страницу?'
    );
  }
  return true;
};
