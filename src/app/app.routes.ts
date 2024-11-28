import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { IncomesComponent } from './pages/incomes/incomes.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'login',component:LoginComponent },
    {path:'register',component:RegistrationComponent},
    {path:'home',component:HomeComponent},
    {path:'income',component:IncomesComponent},
    {path:'income/:id',component:IncomesComponent},
    {path:'expense',component:ExpensesComponent},
    {path:'expense/:id',component:ExpensesComponent},
];
