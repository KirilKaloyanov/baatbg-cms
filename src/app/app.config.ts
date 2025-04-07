import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp} from '@angular/fire/app';
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage'
import { Clipboard } from '@angular/cdk/clipboard'
import { provideQuillConfig } from "ngx-quill/config";

import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

import { routes } from './app.routes';
import { environment } from '../environments/environment.development';
import { LogLevel, setLogLevel } from '@angular/fire';

setLogLevel(LogLevel.VERBOSE);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideFirebaseApp(() => 
      initializeApp(environment.firebaseConfig)
    ),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideQuillConfig({
      modules: {
        toolbar: true,
      },
      placeholder: 'Compose an epic...',
      theme: 'snow',
      sanitize: true
    }),
    Clipboard,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {autoFocus: 'first-header'}}
  ]
};
