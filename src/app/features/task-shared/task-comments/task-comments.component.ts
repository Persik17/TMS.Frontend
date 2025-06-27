import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.scss'],
})
export class TaskCommentsComponent {
  @Input() comments: any[] = [];
  @Input() newCommentText = '';
  @Input() addingComment = false;

  @Output() newCommentTextChange = new EventEmitter<string>();
  @Output() addComment = new EventEmitter<void>();
}
