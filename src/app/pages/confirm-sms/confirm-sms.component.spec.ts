import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSmsComponent } from './confirm-sms.component';

describe('ConfirmSmsComponent', () => {
  let component: ConfirmSmsComponent;
  let fixture: ComponentFixture<ConfirmSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmSmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
