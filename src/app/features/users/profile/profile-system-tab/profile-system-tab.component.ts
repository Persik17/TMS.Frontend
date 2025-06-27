import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemSettings } from '../../../../core/models/system-settings.model';

@Component({
  selector: 'app-profile-system-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-system-tab.component.html',
  styleUrls: ['./profile-system-tab.component.scss'],
})
export class ProfileSystemTabComponent {
  @Input() systemSettings!: SystemSettings;
  @Input() bgModalOpen!: boolean;
  @Input() bgTemplates!: { name: string; url: string }[];
  @Input() bgColors!: string[];
  @Output() openBgModal = new EventEmitter<void>();
  @Output() closeBgModal = new EventEmitter<void>();
  @Output() selectTemplateBg = new EventEmitter<{ name: string; url: string }>();
  @Output() selectColorBg = new EventEmitter<string>();
  @Output() boardBgUpload = new EventEmitter<Event>();

  getBoardBgStyle() {
    if (this.systemSettings.boardBgType === 'color') {
      return { background: this.systemSettings.boardBgColor };
    }
    if (
      (this.systemSettings.boardBgType === 'template' || this.systemSettings.boardBgType === 'custom')
      && this.systemSettings.boardBgUrl
    ) {
      return { background: `url('${this.systemSettings.boardBgUrl}') center/cover` };
    }
    return {};
  }

  onBoardBgUpload(event: Event) {
    this.boardBgUpload.emit(event);
  }
}
