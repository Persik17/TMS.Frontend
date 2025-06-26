import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent-banner.html',
  styleUrls: ['./cookie-consent-banner.scss'],
})
export class CookieConsentBannerComponent implements OnInit {
  cookieConsentVisible = false;
  @Output() consentChange = new EventEmitter<'accepted' | 'declined'>();

  ngOnInit() {
    const consent = localStorage.getItem('cookie_consent');
    this.cookieConsentVisible = consent !== 'accepted';
  }

  acceptCookies() {
    localStorage.setItem('cookie_consent', 'accepted');
    this.cookieConsentVisible = false;
    this.consentChange.emit('accepted');
  }

  declineCookies() {
    localStorage.setItem('cookie_consent', 'declined');
    this.cookieConsentVisible = false;
    this.consentChange.emit('declined');
  }
}
