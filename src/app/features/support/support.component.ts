import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent {
  supportData = {
    subject: '',
    message: '',
  };
  screenshots: { file: File; preview: string }[] = [];
  successMsg = '';

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.screenshots.push({ file, preview: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removeScreenshot(idx: number) {
    this.screenshots.splice(idx, 1);
  }

  submitSupport() {
    this.successMsg =
      'Ваше обращение успешно отправлено! Мы свяжемся с вами по указанным контактам.';
    this.supportData = { subject: '', message: '' };
    this.screenshots = [];
  }
}
