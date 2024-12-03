import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseServicesService } from '../../service/apiService/expense-services.service';
import { ToastrService } from 'ngx-toastr';
import { IncomeModel } from '../../models/income.model';
import { ActivatedRoute, Router } from '@angular/router';
import {userModel } from '../../models/auth.model';
import { selectCurrentUser } from '../../redux/authentication.selector';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.css'
})

export class IncomesComponent implements OnInit {
  incomeForm: FormGroup;
  errorObj: { [key: string]: string } = {};
  uid:string = Date.now().toString()
  id: string | null = null;
  incomeData:IncomeModel[]=[]
  confirmModalOpen:boolean = false
  selectedId: string | null = null;
  currentUser:userModel=new Object() as userModel
  loginModalOpen:boolean = false

  constructor(private fb:FormBuilder, private incomeService:ExpenseServicesService,private toast:ToastrService,private route:ActivatedRoute,private router:Router,private store:Store) {
    this.incomeForm=this.fb.group({
      title:["",Validators.required],
      amount:["",[Validators.required,Validators.pattern('^[0-9]+$')]],
      date:["",Validators.required],
      description:["",Validators.required],
      category:["",Validators.required]
    })
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe((params)=>{
      this.id=params.get('id');
    })
    
    this.handleChangesClearErrors()
    this.getAllIncomeData()
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
      this.incomeData=this.currentUser.Incomedetails as IncomeModel[]
    })
  }

 

  handleEdit(data:string){
    this.router.navigate([`/income/${data}`]).then(()=>{
      if(this.id){
        this.patchFormForEdit(this.id)
      }
    })
  }

  getAllIncomeData(){
    this.incomeService.getIncomes().subscribe((data:any)=>{
      // this.incomeData=data;

if (this.id) {
  this.patchFormForEdit(this.id);
}
    })
  }

  patchFormForEdit(id: string) {
    const getIncomeToEdit = this.incomeData.find(e => e.id === id);
    if (getIncomeToEdit) {
      this.incomeForm.patchValue({
        title: getIncomeToEdit.title,
        amount: getIncomeToEdit.amount,
        date: getIncomeToEdit.date,
        description: getIncomeToEdit.description,
        category: getIncomeToEdit.category
      });
    }
  }

  handleDelete(data:string){
    if(isEmpty(this.currentUser)){
      this.loginModalOpen=true;
      return;
    }
    this.selectedId=data;
    this.confirmModalOpen=true;
  }

  handleShowModal(){
    if(this.selectedId){
      this.incomeService.deleteIncomesById(this.selectedId).subscribe(()=>{
       this.toast.success('Income deleted successfully');
       this.getAllIncomeData()
       this.selectedId=null;
       this.confirmModalOpen=false;
     })
    }
  }
  handleCloseConfirm(){
    this.confirmModalOpen=false;
  }

  handleChangesClearErrors(){
    Object.keys(this.incomeForm.controls).forEach((key) => {
      this.incomeForm.get(key)?.valueChanges.subscribe(() => {
        if (this.errorObj[key]) {
          delete this.errorObj[key]; 
        }
        });
      })
  }

  handleSubmit(e:Event){
    e.preventDefault();
    if(isEmpty(this.currentUser)){
      this.loginModalOpen=true;
      return;
    }
    
    this.errorObj={}
    this.handleValidate()
    if(this.incomeForm.valid){

      const income:any={...this.incomeForm.value}
      // console.log('income: ', income);

      if(this.id){
        this.incomeService.updateIncomesById(income, this.id).subscribe(()=>{
          this.incomeForm.reset();
          this.toast.success('Income updated successfully');
          this.getAllIncomeData()

           // Update user document
          const incomeData={...income,id:this.id}
        this.incomeService.updateUserDocByIdReplace(this.currentUser.id, incomeData).subscribe(() => {
          console.log('User document updated successfully');
        });
        })
      }else{
        this.incomeService.createIncomes(income,this.uid).subscribe((uid)=>{
          // console.log('uid: ', uid);
          this.incomeForm.reset();
          this.toast.success('Income added successfully');
          this.getAllIncomeData()
          const incomeData={...income,id:this.uid}
          this.incomeService.updateUserDocById(this.currentUser.id, incomeData).subscribe(() => {
            console.log('User document updated successfully');
          });
        })
      }

    }else {
      setTimeout(() => {
        const firstErrorElement = document.querySelector(".error")as HTMLElement;
        if (firstErrorElement) {
          firstErrorElement.focus();
        }
      }, 1000);
    }
  }

  handleValidate() {
    Object.keys(this.incomeForm.controls).forEach(key=>{
      if(this.incomeForm.get(key)?.errors?.['required']){
        this.errorObj[key]=`The ${key} is required`;
      }
      if(this.incomeForm.get(key)?.errors?.['pattern']){
        this.errorObj[key]=`The ${key} should be a number`;
      }
    })
    return this.errorObj;
  }

  errorObjArr(){
    return Object.keys(this.errorObj)
  }

  focusInput(id:string){
    const inputElement = document.getElementById(id);
    if(inputElement){
      inputElement.focus();
    }
  }

  handleNavigate(data:string){
    this.router.navigateByUrl(data)
      }

// download full table

      // handleExportExcel(){
      //   const filename ='ExcelSheet.xlsx';
      //  // passing table id
      //   let data =document.getElementById('table-data')
      //   const worksheet:XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
      //   // generate workbook  and add the worksheet
      //   const workbook: XLSX.WorkBook =XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(workbook,worksheet,'Sheet1')
      //   // save to file
      //   XLSX.writeFile(workbook, filename);
      // }


      // remove action from table
      handleExportExcel() {
        const currentDate = new Date().toISOString().slice(0, 10); // Gets current date in YYYY-MM-DD format
const filename = `IncomeSheet_${currentDate}.xlsx`;
        
        // Get the table element
        const table = document.getElementById('table-data');
        
        // Check if the table exists before proceeding
        if (!table) {
          console.error('Table element not found');
          return; // Exit if the table is not found
        }
      
        // Clone the table to avoid modifying the original table structure
        const tableClone = table.cloneNode(true) as HTMLElement;
      
        // Get all header cells
        const headerCells = tableClone.querySelectorAll('thead th');
        // console.log('Header Cells:', headerCells);
      
        // Define action column indices
        const actionColumnIndices = [5, 6]; // Action columns (Edit and Delete)
      
        // Remove action columns in the header
        actionColumnIndices.forEach(index => {
          const headerCell = headerCells[index];
          if (headerCell) {
            console.log(`Removing header cell at index ${index}`);
            headerCell.remove();
          } else {
            console.warn(`Header cell at index ${index} not found`);
          }
        });
      
        // Get all rows in the table body
        const rows = tableClone.querySelectorAll('tbody tr');
        // console.log('Rows:', rows);
      
        // Remove action columns in the rows
        rows.forEach((row, rowIndex) => {
          const cells = row.querySelectorAll('td');
          console.log(`Row ${rowIndex} Cells:`, cells);
      
          actionColumnIndices.reverse().forEach(index => {
            const cell = cells[index];
            if (cell) {
              console.log(`Removing data cell at index ${index} in row ${rowIndex}`);
              cell.remove();
            } else {
              console.warn(`Data cell at index ${index} not found in row ${rowIndex}`);
            }
          });
        });
      
        // Convert the modified table to a worksheet
        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableClone);
      
        // Generate the workbook and add the worksheet
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
        // Save the file
        XLSX.writeFile(workbook, filename);
      }
      


}
