import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskHistoryTabComponent } from './task-history-tab.component';

describe('TaskHistoryTabComponent', () => {
  let component: TaskHistoryTabComponent;
  let fixture: ComponentFixture<TaskHistoryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskHistoryTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskHistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
