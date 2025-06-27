import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFilesTabComponent } from './task-files-tab.component';

describe('TaskFilesTabComponent', () => {
  let component: TaskFilesTabComponent;
  let fixture: ComponentFixture<TaskFilesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFilesTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskFilesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
