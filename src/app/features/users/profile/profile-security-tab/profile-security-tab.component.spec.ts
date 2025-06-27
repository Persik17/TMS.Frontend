import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSecurityTabComponent } from './profile-security-tab.component';

describe('ProfileSecurityTabComponent', () => {
  let component: ProfileSecurityTabComponent;
  let fixture: ComponentFixture<ProfileSecurityTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSecurityTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSecurityTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
