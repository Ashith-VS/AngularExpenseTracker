import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseServicesService } from '../../service/apiService/expense-services.service';
import { ToastrService } from 'ngx-toastr';
import { IncomeModel } from '../../models/income.model';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private fb:FormBuilder, private incomeService:ExpenseServicesService,private toast:ToastrService,private route:ActivatedRoute,private router:Router) {
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
this.incomeData=data;
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
        })
      }else{
        this.incomeService.createIncomes(income,this.uid).subscribe(()=>{
          this.incomeForm.reset();
          this.toast.success('Income added successfully');
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


}
