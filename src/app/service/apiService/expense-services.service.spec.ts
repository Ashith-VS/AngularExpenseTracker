import { TestBed } from '@angular/core/testing';

import { ExpenseServicesService } from './expense-services.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';

describe('ExpenseServicesService', () => {
  let service: ExpenseServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
        provideFirestore(()=>getFirestore()),
      ]
    });
    service = TestBed.inject(ExpenseServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
