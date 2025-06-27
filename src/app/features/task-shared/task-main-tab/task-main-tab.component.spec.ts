import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMainTabComponent } from './task-main-tab.component';

describe('TaskMainTabComponent', () => {
  let component: TaskMainTabComponent;
  let fixture: ComponentFixture<TaskMainTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskMainTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskMainTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
