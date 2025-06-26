import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-post-login-redirect',
  standalone: true,
  templateUrl: './post-login-redirect.component.html',
  styleUrls: ['./post-login-redirect.component.scss'],
})
export class PostLoginRedirectComponent implements OnInit {
  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    try {
      let company = await this.api.getFirstCompany();
      if (!company) {
        company = await this.api.createDefaultCompany();
      }
      let board = await this.api.getFirstBoard(company.id);
      if (!board) {
        board = await this.api.createDefaultBoard(company.id);
      }
      this.router.navigate([`/company/${company.id}/board/${board.id}`]);
    } catch (e) {
      this.router.navigate(['/error'], {
        state: { message: 'Ошибка загрузки данных' },
      });
    }
  }
}
