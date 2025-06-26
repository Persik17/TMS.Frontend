import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  private currentRoles: string[] = [];

  @Input()
  set appHasRole(roles: string | string[]) {
    this.currentRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  private userRoles: string[] = ['admin', 'user']; // пример, заменить на реальное получение ролей

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}

  private updateView() {
    if (this.currentRoles.some((role) => this.userRoles.includes(role))) {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
  }
}
