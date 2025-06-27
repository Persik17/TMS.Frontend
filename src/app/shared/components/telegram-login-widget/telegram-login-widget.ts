import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  NgZone,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-telegram-login-widget',
  standalone: true,
  template: `<div #widgetContainer></div>`,
})
export class TelegramLoginWidgetComponent implements AfterViewInit {
  @Output() telegramAuth = new EventEmitter<any>();
  @Input() botName: string = 'tms_notify_support_bot';
  @Input() size: 'large' | 'medium' | 'small' = 'large';

  @ViewChild('widgetContainer', { static: true }) widgetContainer!: ElementRef;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      if (this.widgetContainer?.nativeElement) {
        this.widgetContainer.nativeElement.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?7';
        script.setAttribute('data-telegram-login', this.botName);
        script.setAttribute('data-size', this.size);
        script.setAttribute('data-userpic', 'true');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.async = true;
        this.widgetContainer.nativeElement.appendChild(script);

        // Глобальный callback
        (window as any).onTelegramAuth = (user: any) => {
          this.zone.run(() => {
            this.telegramAuth.emit(user);
          });
        };
      }
    });
  }
}
