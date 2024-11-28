import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IncomeModel } from '../../models/income.model';
import { ExpenseServicesService } from '../../service/apiService/expense-services.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  expenseForm: FormGroup;
  errorObj: { [key: string]: string } = {};
  uid:string = Date.now().toString()
  id: string | null = null;
  expenseData:IncomeModel[]=[]
  confirmModalOpen:boolean = false
  selectedId: string | null = null;


  constructor(private fb:FormBuilder, private expenseService:ExpenseServicesService,private toast:ToastrService,private route:ActivatedRoute,private router:Router) {
    this.expenseForm=this.fb.group({
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
  }

  getAllIncomeData(){
    this.expenseService.getExpenses().subscribe((data:any)=>{
      this.expenseData=data;
      if (this.id) {
        this.patchFormForEdit(this.id);
      }
    })
  }
  
  handleEdit(data:string){
    this.router.navigate([`/expense/${data}`]).then(()=>{
      if(this.id){
        this.patchFormForEdit(this.id)
      }
    })
  }

  patchFormForEdit(id: string) {
    const getIncomeToEdit = this.expenseData.find(e => e.id === id);
    if (getIncomeToEdit) {
      this.expenseForm.patchValue({
        title: getIncomeToEdit.title,
        amount: getIncomeToEdit.amount,
        date: getIncomeToEdit.date,
        description: getIncomeToEdit.description,
        category: getIncomeToEdit.category
      });
    }
  }

  handleDelete(data:string){
    this.selectedId=data;
    this.confirmModalOpen=true;
  }

  handleShowModal(){
    if(this.selectedId){
      this.expenseService.deleteExpensesById(this.selectedId).subscribe(()=>{
       this.toast.success('Expenses deleted successfully');
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
    Object.keys(this.expenseForm.controls).forEach((key) => {
      this.expenseForm.get(key)?.valueChanges.subscribe(() => {
        if (this.errorObj[key]) {
          delete this.errorObj[key]; 
        }
        });
      })
  }

  handleSubmit(e:Event){
    e.preventDefault();
    this.errorObj={}
    this.handleValidate()
    if(this.expenseForm.valid){
      const income:any={...this.expenseForm.value}
      // console.log('income: ', income);

      if(this.id){
        this.expenseService.updateExpensesById(income, this.id).subscribe(()=>{
          this.expenseForm.reset();
          this.toast.success('Expenses updated successfully');
          this.getAllIncomeData()
        })
      }else{
        this.expenseService.createExpenses(income,this.uid).subscribe(()=>{
          this.expenseForm.reset();
          this.toast.success('Expenses added successfully');
          this.getAllIncomeData()
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
    Object.keys(this.expenseForm.controls).forEach(key=>{
      if(this.expenseForm.get(key)?.errors?.['required']){
        this.errorObj[key]=`The ${key} is required`;
      }
      if(this.expenseForm.get(key)?.errors?.['pattern']){
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




}
