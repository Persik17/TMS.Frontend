import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot([])),
    importProvidersFrom(AppRoutingModule)
    ]
})
.catch(err => console.error(err));
