import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesComponent } from './incomes.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';

describe('IncomesComponent', () => {
  let component: IncomesComponent;
  let fixture: ComponentFixture<IncomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomesComponent],
      providers:[
        provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
        provideFirestore(()=>getFirestore()),
        provideToastr(),
        provideRouter([]),
        provideStore()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
