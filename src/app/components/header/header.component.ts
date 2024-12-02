import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../service/apiService/auth-service.service';
import { Store } from '@ngrx/store';
import { authenticationAction } from '../../redux/authentication.action';
import { userModel } from '../../models/auth.model';
import { selectCurrentUser } from '../../redux/authentication.selector';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  @ViewChild('dropdownContainer') dropdownContainer!:ElementRef;
  currentUser:userModel=new Object() as userModel
  isDropdownOpen = false; 
  isProfileModalVisible = false;
  editing = false;

  constructor(private authService: AuthServiceService,private store:Store,private router:Router ) {}  

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
        console.log('e.target.result: ', e.target.result);
        this.currentUser.avatar = e.target.result;
       
      };
      reader.readAsDataURL(file);
    }
  }

  startEditing() {
    this.editing = true;
  }
  
  cancelEditing() {
    this.editing = false;
  }


}
