import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseServicesService {

  constructor(private firestore:Firestore) { }

  createIncomes(data: any,uid:string) {
    return from(setDoc(doc(this.firestore,"incomes",uid),{...data,id:uid}))
  }

  getIncomes() {
    return from(getDocs(collection(this.firestore,"incomes"))).pipe(map(snapshot=> snapshot.docs.map(doc=> doc.data())))
  }

  updateIncomesById(data: any,id:string){
    const updateEvent =doc(this.firestore,"incomes",id)
    return from(updateDoc(updateEvent,{...data}))
  }

  deleteIncomesById(id:string){
    const deleteEvent =doc(this.firestore,"incomes",id)
    return from(deleteDoc(deleteEvent))
  }

  createExpenses(data: any,uid:string) {
    return from(setDoc(doc(this.firestore,"expenses",uid),{...data,id:uid}))
  }

  getExpenses() {
    return from(getDocs(collection(this.firestore,"expenses"))).pipe(map(snapshot=> snapshot.docs.map(doc=> doc.data())))
  }

  updateExpensesById(data: any,id:string){
    const updateEvent =doc(this.firestore,"expenses",id)
    return from(updateDoc(updateEvent,{...data}))
  }

  deleteExpensesById(id:string){
    const deleteEvent =doc(this.firestore,"expenses",id)
    return from(deleteDoc(deleteEvent))
  }




}
