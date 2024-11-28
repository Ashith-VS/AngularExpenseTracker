import { AuthServiceService } from './../../service/apiService/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import LoginInput from "../../constants/inputs.json"
import { AuthModel } from '../../models/auth.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm =new FormGroup({});
errorObj: { [key: string]: string } = {};
JsonInput:AuthModel[]=LoginInput.login

constructor(private fb:FormBuilder,private Auth :AuthServiceService,private router:Router) {}

ngOnInit(): void {
  this.buildForm()
  this.handleChangesClearErrors();
 }

 buildForm(){
   this.JsonInput.forEach((item:any)=>{
     const validators = [];
     if (item.isrequired) {
       validators.push(Validators.required);
     }
     if (item.ispattern) {
       validators.push(Validators.pattern(item.ispattern));
     }

     const controller = this.fb.control(item.value,validators)
     this.loginForm.addControl(item.name,controller)
   })
 }

 handleChangesClearErrors(){
   Object.keys(this.loginForm.controls).forEach((key) => {
     this.loginForm.get(key)?.valueChanges.subscribe(() => {
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
   if(this.loginForm.valid){
     this.Auth.LoginUser(this.loginForm.value).subscribe({
       next: () => {
         // console.log('User Logged in successfully');
         this.router.navigateByUrl('/home')
       },
       error: (err:any) => {
         console.error('Error occurred while logging in', err);
         this.errorObj['common']=err.message||'Failed to login. Please try again later';
       }
     })
   }else{
     setTimeout(() => {
       const firstErrorElement = document.querySelector(".error")as HTMLElement;
       if (firstErrorElement) {
         firstErrorElement.focus();
       }
     }, 1000);
   }
 }

 handleValidate(){
   Object.keys(this.loginForm.controls).forEach((key)=>{
     const field =this.JsonInput.find((item:any)=>item.name===key)
     if(!field) return;
     if(this.loginForm.get(key)?.errors?.['required']){
       this.errorObj[key]=`${field.label} is required`;
     }
     if(this.loginForm.get(key)?.errors?.['pattern']){
       this.errorObj[key]=field.patternErrorMessage||`Invalid ${field.label}`;
     }
   })
   return this.errorObj
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
