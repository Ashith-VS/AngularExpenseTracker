import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  const router= inject(Router)
  const platFormId = inject(PLATFORM_ID)

  if(isPlatformBrowser(platFormId)){
    const currentUser = localStorage.getItem('currentUser')
    if(currentUser !== null ){
     return true;;// Allow access 
    }else{
      router.navigateByUrl('login')
      return false;
    }
  }else{
    return false; // Assuming the server-side rendering is supported
  }
};
