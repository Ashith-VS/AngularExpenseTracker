import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideStore } from '@ngrx/store';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers:[
        provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
        provideFirestore(()=>getFirestore()),
        provideAuth(()=>getAuth()),
        provideStore(),
        provideToastr(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
