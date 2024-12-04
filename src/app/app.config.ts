import { environment } from './../environments/environment';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideClientHydration } from '@angular/platform-browser';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideStore, StoreModule } from '@ngrx/store';
import { rootReducer } from './redux';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    provideFirestore(()=>getFirestore()),
    provideStorage(()=>getStorage()),
    provideAuth(()=>getAuth()),
    provideStore(),
    importProvidersFrom([
     StoreModule.forRoot(rootReducer)
    ]),
    provideToastr({
      timeOut:10000,
      positionClass:"toast-top-center",
      preventDuplicates:true,
      closeButton:true,
      progressBar:true,
    }),
    provideAnimations(),
    ]
};
