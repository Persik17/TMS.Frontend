import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Input,
  NgZone,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-telegram-login-widget',
  standalone: true,
  templateUrl: './telegram-login-widget.html',
  styleUrls: ['./telegram-login-widget.scss'],
})
export class TelegramLoginWidgetComponent implements AfterViewInit, OnDestroy {
  @Input() botName: string = 'tms_notify_support_bot';
  @Input() authUrl: string = 'https://localhost:7087/api/auth/telegram';
  @Input() size: 'large' | 'medium' | 'small' = 'large';
  @Input() radius: string = '8';
  @Input() requestAccess: string = 'write';
  @Input() userpic: string = 'true';

  @ViewChild('widgetContainer', { static: true }) widgetContainer!: ElementRef;
  private telegramScript?: HTMLScriptElement;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      if (this.widgetContainer?.nativeElement) {
        this.widgetContainer.nativeElement.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?7';
        script.setAttribute('data-telegram-login', this.botName);
        script.setAttribute('data-size', this.size);
        script.setAttribute('data-radius', this.radius);
        script.setAttribute('data-auth-url', this.authUrl);
        script.setAttribute('data-request-access', this.requestAccess);
        script.setAttribute('data-userpic', this.userpic);
        script.async = true;
        this.widgetContainer.nativeElement.appendChild(script);
        this.telegramScript = script;
      }
    });
  }

  ngOnDestroy() {
    if (this.telegramScript?.parentNode) {
      this.telegramScript.parentNode.removeChild(this.telegramScript);
    }
  }
}
