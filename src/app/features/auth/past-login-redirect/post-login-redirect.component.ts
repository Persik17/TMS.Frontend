import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { BoardService } from '../../../core/services/board.service';

@Component({
  selector: 'app-post-login-redirect',
  standalone: true,
  templateUrl: './post-login-redirect.component.html',
  styleUrls: ['./post-login-redirect.component.scss'],
})
export class PostLoginRedirectComponent implements OnInit {
  constructor(
    private companyService: CompanyService,
    private boardService: BoardService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      let company = await this.companyService.getFirstCompany().toPromise();
      if (!company) {
        company = await this.companyService.createDefaultCompany().toPromise();
      }
      if (!company?.id) {
        throw new Error('Company id is undefined!');
      }
      let board = await this.boardService.getFirstBoard(company.id).toPromise();
      if (!board) {
        board = await this.boardService
          .createDefaultBoard(company.id)
          .toPromise();
      }
      this.router.navigate([`/company/${company.id}/board/${board.id}`]);
    } catch (e) {
      this.router.navigate(['/error'], {
        state: { message: 'Ошибка загрузки данных' },
      });
    }
  }
}
