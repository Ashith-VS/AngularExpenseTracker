import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../service/apiService/auth-service.service';
import { Store } from '@ngrx/store';
import { authenticationAction } from '../../redux/authentication.action';
import { userModel } from '../../models/auth.model';
import { selectCurrentUser } from '../../redux/authentication.selector';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  @ViewChild('dropdownContainer') dropdownContainer!:ElementRef;
  currentUser:userModel=new Object() as userModel
  isDropdownOpen = false; 
  isProfileModalVisible = false;
  editing = false;
  editingUser: any;
  changePassword:boolean = false
  password:string='';
  newPassword:string='';
  confirmPassword:string='';
  changePasswordError:{[key:string]:string} = {}
  changePasswordSuccessModal:boolean = false;

  constructor(private authService: AuthServiceService,private store:Store,private router:Router,private homeService :AuthServiceService ,private toast:ToastrService) {}  

  @HostListener('document:click',[`$event.target`])
  public onClick(targetElement:HTMLElement):void{
    const clickedInside = this.dropdownContainer.nativeElement.contains(targetElement);
    if(!clickedInside&& this.isDropdownOpen){
      this.isDropdownOpen=false
    }
  }

  ngOnInit(): void{
    this.authService.getcurrentUserId().subscribe((data:any) => {
      if(data.uid){
        this.authService.currentUser(data.uid).subscribe((res:any)=>{
          this.store.dispatch(authenticationAction({...res}))
        })
      }
    });

    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
      // console.log('this.currentUser : ', this.currentUser );
    })
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen; 
  }

  handleLogout(){
    this.authService.logout().subscribe(()=>{
      window.location.reload();
      localStorage.removeItem('currentUser')
      this.router.navigate(['/login']);
     this.isCurrentUserEmpty();
    })
  }

  isCurrentUserEmpty(): boolean {
    return Object.values(this.currentUser).every(value => value === '');
  }

  handleProfile(){
    this.isProfileModalVisible = true;
  }

  closeProfileModal() {
    this.isProfileModalVisible = false;
    this.editing = false;
  }

  handleAvatar(e:Event):void{
    const file=(e.target as HTMLInputElement).files?.[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (e:any) => {
        const updatedUser = { ...this.currentUser };
        updatedUser.avatar = e.target.result; 
        this.currentUser = updatedUser;
        this.currentUser.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  startEditing() {
    this.editingUser = { ...this.currentUser }; 
    this.editing = true;
  }
  
  cancelEditing() {
    this.editing = false;
  }

  handleUpdateProfile(){
    const data={
      name: this.editingUser.name,
      email:this.editingUser.email,
      avatar: this.currentUser.avatar,
    }
    this.homeService.isUpdateUser(data,this.currentUser.id).subscribe(res=>{
      this.currentUser = { ...this.editingUser };
      this.editing = false;
      this.closeProfileModal();
      this.toast.success('Profile updated successfully');
    })
  }

  handleChangePasswordToggle(){
    this.changePassword=!this.changePassword
    this.isProfileModalVisible=false
  }

  changePasswordArray(){
    return Object.keys(this.changePasswordError)
  }
  focusInput(id:string){
    const inputElement = document.getElementById(id);
    if(inputElement){
      inputElement.focus();
    }
  }

  handlePasswordChange(e:Event){
    e.preventDefault();
    this.handleChangePasswordValidation();
    if(isEmpty(this.changePasswordError)){
      const data={
        currentPassword: this.password,
        newPassword: this.newPassword
      }
      this.homeService.isChangePassword(data).subscribe({
        next:()=>{
          this.toast.success('Password changed successfully');
          this.password='';
          this.newPassword='';
          this.confirmPassword='';
          // show a success modal
          this.changePasswordSuccessModal=true
        },
        error:(err)=>{
          const errorMessage = err?.message || 'An error occurred while changing the password';
          this.toast.error(errorMessage);
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

  handleChangePasswordValidation(){
    this.changePasswordError = {};
    if (!this.password) {
      this.changePasswordError['password'] = 'Current password is required';
    }
    if (!this.newPassword) {
      this.changePasswordError['newPassword'] = 'New password is required';
    }
    if (!this.confirmPassword) {
      this.changePasswordError['confirmPassword'] = 'Please confirm the new password';
    }
    // Additional validation for new password strength
    const pattern = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (this.newPassword && !pattern.test(this.newPassword)) {
      this.changePasswordError['newPassword'] = 'Password must be at least 8 characters, contain at least one uppercase letter, and include one special character';
    }
  
    // Check if new password matches confirmation password
    if (this.newPassword && this.confirmPassword && this.newPassword !== this.confirmPassword) {
      this.changePasswordError['confirmPassword'] = 'Passwords do not match';
    }
    return this.changePasswordError
  }

  handleChangePasswordClear(data:string){
    this.changePasswordError[data] = '';
  }
  handleClosePasswordChangeModal(){
    this.changePassword=false;
    this.changePasswordSuccessModal=false;
  }


}
