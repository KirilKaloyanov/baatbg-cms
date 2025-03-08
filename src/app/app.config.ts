import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp} from '@angular/fire/app';
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage'
import { provideQuillConfig } from "ngx-quill/config";

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
    })
  ]
};
