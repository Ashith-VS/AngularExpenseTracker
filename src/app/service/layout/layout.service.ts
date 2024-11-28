import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public showLayout = true;

  constructor(private router:Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const excludedRoutes = ['/login', '/register']; // Add routes that should hide the layout
        this.showLayout = !excludedRoutes.includes(event.url);
      });
   }
}
