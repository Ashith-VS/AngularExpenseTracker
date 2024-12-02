import { IncomeModel } from "./income.model";

export interface AuthModel {
    id: string;
    label: string;
    type: string;
    name: string;
    placeholder?: string;
    isrequired: boolean;
    ispattern?: string;
    patternErrorMessage?: string;
  }

  export interface userModel {
    name: string;
    email: string;
    id: string;
    role: string;
    avatar?: string|null;
    Incomedetails?:IncomeModel[];
    expensedetails?:IncomeModel[];
  }

  
  

  
  