import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSystemTabComponent } from './profile-system-tab.component';

describe('ProfileSystemTabComponent', () => {
  let component: ProfileSystemTabComponent;
  let fixture: ComponentFixture<ProfileSystemTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSystemTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSystemTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
