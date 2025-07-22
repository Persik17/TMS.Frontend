import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-login-redirect',
  standalone: true,
  templateUrl: './post-login-redirect.component.html',
  styleUrls: ['./post-login-redirect.component.scss'],
})
export class PostLoginRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.navigate(['/boards']);
  }
}
