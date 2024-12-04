import { TestBed } from '@angular/core/testing';

import { AuthServiceService } from './auth-service.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';

describe('AuthServiceService', () => {
  let service: AuthServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
        provideFirestore(()=>getFirestore()),
        provideAuth(()=>getAuth())
      ]
    });
    service = TestBed.inject(AuthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
