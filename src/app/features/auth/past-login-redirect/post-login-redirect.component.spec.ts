import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastLoginRedirectComponent } from './post-login-redirect.component';

describe('PastLoginRedirectComponent', () => {
  let component: PastLoginRedirectComponent;
  let fixture: ComponentFixture<PastLoginRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastLoginRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastLoginRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
