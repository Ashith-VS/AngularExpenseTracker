import { Injectable } from '@angular/core';
import { arrayUnion, collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseServicesService {

  constructor(private firestore:Firestore) { }

  createIncomes(data: any,uid:string) {
    return from(setDoc(doc(this.firestore,"incomes",uid),{...data,id:uid})).pipe(map(()=>uid))
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
    return from(setDoc(doc(this.firestore,"expenses",uid),{...data,id:uid})).pipe(map(()=>uid))
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

  updateUserDocById(id:string,data:any){
    const updateUser =doc(this.firestore,"users",id)
    return from(updateDoc(updateUser,{Incomedetails:arrayUnion({...data})}))
  }

  updateUserDocByIdReplace(id:string,updatedIncome:any){
    const userDocRef = doc(this.firestore, "users", id);
    return from(getDoc(userDocRef)).pipe(
      // Read the current user document
      map((docSnapshot) => {
        const userData = docSnapshot.data();
  
        if (userData && userData['Incomedetails']) {
          // Replace the specific entry in the array
          const updatedDetails = userData['Incomedetails'].map((item: any) =>
            item.id === updatedIncome.id ? updatedIncome : item
          );
  
          // Write the updated array back to Firestore
          return updateDoc(userDocRef, { Incomedetails: updatedDetails });
        }
  
        // If no details exist, add the updated income as a new entry
        return updateDoc(userDocRef, { Incomedetails: [updatedIncome] });
      })
    );
  }
  updateUserExpenseDocById(id:string,data:any){
    const updateUser =doc(this.firestore,"users",id)
    return from(updateDoc(updateUser,{expensedetails:arrayUnion({...data})}))
  }
  updateUserDocsByIdReplace(id:string,updatedexpense:any){
    const userDocRef = doc(this.firestore, "users", id);
    return from(getDoc(userDocRef)).pipe(
      // Read the current user document
      map((docSnapshot) => {
        const userData = docSnapshot.data();
  
        if (userData && userData['expensedetails']) {
          // Replace the specific entry in the array
          const updatedDetails = userData['expensedetails'].map((item: any) =>
            item.id === updatedexpense.id ? updatedexpense : item
          );
  
          // Write the updated array back to Firestore
          return updateDoc(userDocRef, { expensedetails: updatedDetails });
        }
  
        // If no details exist, add the updated income as a new entry
        return updateDoc(userDocRef, { expensedetails: [updatedexpense] });
      })
    );
  }





}
