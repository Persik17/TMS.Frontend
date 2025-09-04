import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SystemSettings,
  ThemeType,
} from '../../../../core/models/system-settings.model';

@Component({
  selector: 'app-profile-system-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-system-tab.component.html',
  styleUrls: ['./profile-system-tab.component.scss'],
})
export class ProfileSystemTabComponent {
  @Input() systemSettings!: SystemSettings;
  @Input() bgModalOpen: boolean = false;

  @Output() openBgModal = new EventEmitter<void>();
  @Output() closeBgModal = new EventEmitter<void>();
  @Output() selectTemplateBg = new EventEmitter<{
    name: string;
    url: string;
  }>();
  @Output() saveSystemSettings = new EventEmitter<SystemSettings>();

  themeOptions = [
    { value: ThemeType.Light, label: 'Светлая' },
    { value: ThemeType.Dark, label: 'Тёмная' },
  ];

  bgTemplates: { name: string; url: string }[] = [
    {
      name: 'Горы',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    },
    {
      name: 'Лес',
      url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    },
    {
      name: 'Город',
      url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    },
    {
      name: 'Море',
      url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368',
    },
  ];

  saveResult: {
    show: boolean;
    status: 'success' | 'error';
    message: string;
  } | null = null;
  originalSettings: SystemSettings | null = null;

  ngOnInit() {
    this.originalSettings = JSON.parse(JSON.stringify(this.systemSettings));
  }

  selectBgTemplate(tpl: { name: string; url: string }) {
    this.selectTemplateBg.emit(tpl);
  }

  isSettingsChanged(): boolean {
    if (!this.systemSettings || !this.originalSettings) return false;
    return (
      this.systemSettings.theme !== this.originalSettings.theme ||
      this.systemSettings.boardBgUrl !== this.originalSettings.boardBgUrl
    );
  }

  onSaveSettings() {
    if (!this.isSettingsChanged()) return;
    this.saveSystemSettings.emit(this.systemSettings);

    setTimeout(() => {
      localStorage.setItem('boardBgUrl', this.systemSettings.boardBgUrl || '');
      this.showSaveResult('success', 'Настройки сохранены');
      this.originalSettings = JSON.parse(JSON.stringify(this.systemSettings));
    }, 600);
  }

  showSaveResult(status: 'success' | 'error', msg: string) {
    this.saveResult = {
      show: true,
      status,
      message: msg,
    };
    setTimeout(() => {
      if (this.saveResult) this.saveResult.show = false;
    }, 2200);
  }
}
