import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideNgxMask } from 'ngx-mask';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideNgxMask()
  ]
}).catch((err) =>
  console.error(err)
);
