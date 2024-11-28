import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private auth : Auth, private firestore: Firestore,
    // private store:Store
  ) { }

  LoginUser(data:any){
    const { email, password } = data;
    return from(signInWithEmailAndPassword(this.auth,email,password))
  }

  createUser(data:any) {
  const {email, password } = data;
   return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
    switchMap((res)=>from(setDoc(doc(this.firestore, 'users', res.user.uid),{...data,id: res.user.uid,}))) 
   )  
  }


  getcurrentUserId(){
    return new Observable((subscriber) =>{
      onAuthStateChanged(this.auth, (user) => {
        if(user){
          subscriber.next(user); 
          subscriber.complete();
        }
      });
    })
  }

  currentUser(id: string){
    localStorage.setItem('currentUser',id)
    return from(getDoc(doc(this.firestore,'users',id))).pipe(map((snapshot)=>{
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Exclude sensitive fields like password
        const {password,...safeData}=data
        return safeData 
      }else{
        return null;
      }
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    // this.store.dispatch(logoutAction())
    return from(signOut(this.auth));
  }
}
