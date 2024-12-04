import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesComponent } from './expenses.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';

describe('ExpensesComponent', () => {
  let component: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesComponent],
      providers:[
        provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
        provideFirestore(()=>getFirestore()),
        provideToastr(),
        provideRouter([]),
        provideStore()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
