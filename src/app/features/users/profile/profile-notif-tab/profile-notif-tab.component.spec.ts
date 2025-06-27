import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNotifTabComponent } from './profile-notif-tab.component';

describe('ProfileNotifTabComponent', () => {
  let component: ProfileNotifTabComponent;
  let fixture: ComponentFixture<ProfileNotifTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileNotifTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileNotifTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
