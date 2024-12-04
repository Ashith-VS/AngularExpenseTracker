import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideStore } from '@ngrx/store';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers:[
        provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
        provideFirestore(()=>getFirestore()),
        provideAuth(()=>getAuth()),
        provideStore(),
        provideToastr(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'ExpenseTracker' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ExpenseTracker');
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('Hello, ExpenseTracker');
  // });
});
