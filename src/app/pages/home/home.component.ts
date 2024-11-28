import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExpenseServicesService } from '../../service/apiService/expense-services.service';
import { IncomeModel } from '../../models/income.model';
import { Chart, registerables} from 'chart.js';
Chart.register(...registerables)

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
@ViewChild('barchart') barchart: ElementRef | undefined;

  totalIncome: number = 0;
  totalExpenses: number = 0;
  totalBalance: number = 0;
  incomeData:IncomeModel[]=[]
  expenseData:IncomeModel[]=[]

  selectedTimePeriod: string = 'yearly';
  chartInstance:any = null;
  
  constructor(private homeService:ExpenseServicesService) { }

  ngOnInit(): void {
    this.homeService.getExpenses().subscribe((data:any) => {
    this.expenseData=data
    console.log('this.expenseData: ', this.expenseData.map((item)=>item));
    this.calculateTotals();
    this.checkAndRenderChart();
    });
    this.homeService.getIncomes().subscribe((data:any) => {
      this.incomeData=data
      console.log('this.incomeData: ', this.incomeData.map((item)=>item));
      this.calculateTotals();
      this.checkAndRenderChart();
    });
  }

  checkAndRenderChart(): void {
    if (this.incomeData.length > 0 && this.expenseData.length > 0) {
      this.initializeChart();
    }
  }

  calculateTotals() {
    let income = 0;
    let expenses = 0;
    if (this.selectedTimePeriod === 'weekly') {
      const incomeByWeek = this.groupByWeek(this.incomeData);
      const expenseByWeek = this.groupByWeek(this.expenseData);
      income = Object.values(incomeByWeek).reduce((acc, val) => acc + val, 0);
      expenses = Object.values(expenseByWeek).reduce((acc, val) => acc + val, 0);
    } else if (this.selectedTimePeriod === 'monthly') {
      income = this.groupByMonth(this.incomeData);
      expenses = this.groupByMonth(this.expenseData);
    } else if (this.selectedTimePeriod === 'yearly') {
      income = this.groupByYear(this.incomeData);
      expenses = this.groupByYear(this.expenseData);
    }
    // Set the totals
    this.totalIncome = income;
    this.totalExpenses = expenses;
    this.totalBalance = this.totalIncome - this.totalExpenses;
  }

  handleSelectChange(event: Event): void {
    this.selectedTimePeriod = (event.target as HTMLSelectElement).value;
    this.calculateTotals();
    this.updatePieChart(); 
  }

  updatePieChart() {
    if (this.chartInstance) {
      

      // const data = this.getDataByTimePeriod();
      // console.log('Updating chart with data:', data);
      // this.chartInstance.data.datasets[0].data = [data.income, data.expenses];
      this.chartInstance.update();
    }
  }


  initializeChart() {
    if(!this.barchart) return;
    const categoryTotals: any = {
      Rent: 0,
      Salary: 0,
      Groceries: 0,
      Transport: 0,
      Entertainment: 0,
      Food: 0,
      Health: 0,
      Other: 0
    };
      // Sum up the expense data per category
  this.expenseData.forEach(expense => {
    const category = expense.category;
    const amount = parseFloat(expense.amount);
    if (categoryTotals[category] !== undefined) {
      categoryTotals[category] -= amount; // Expenses are subtracted
    }
  });

  // Sum up the income data per category
  this.incomeData.forEach(income => {
    const category = income.category;
    const amount = parseFloat(income.amount);
    if (categoryTotals[category] !== undefined) {
      categoryTotals[category] += amount; // Incomes are added
    }
  });
  const dataValues = [
    categoryTotals.Rent,
    categoryTotals.Salary,
    categoryTotals.Groceries,
    categoryTotals.Transport,
    categoryTotals.Entertainment,
    categoryTotals.Food,
    categoryTotals.Health,
    categoryTotals.Other
  ];
    
    const data={
      labels: ['Rent', 'Salary','Groceries','Transport','Entertainment','Food','Health','Other'],
      datasets: [
        {
          data: dataValues, 
          backgroundColor: [
         'rgba(255, 99, 132, 0.6)',  // Rent
         'rgba(54, 162, 235, 0.6)',  // Salary
         'rgba(255, 159, 64, 0.6)',  // Groceries
         'rgba(75, 192, 192, 0.6)',  // Transport
         'rgba(153, 102, 255, 0.6)', // Entertainment
         'rgba(255, 205, 86, 0.6)',  // Food
         'rgba(201, 203, 207, 0.6)', // Health
         'rgba(255, 159, 132, 0.6)'  // Other
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)', // Rent
            'rgba(255, 99, 132, 1)', // Salary
            'rgba(255, 159, 64, 1)',  // Groceries
            'rgba(75, 192, 192, 1)',  // Transport
            'rgba(153, 102, 255, 1)', // Entertainment
            'rgba(255, 205, 86, 1)',  // Food
            'rgba(201, 203, 207, 1)', // Health
            'rgba(255, 159, 132, 1)'  // Other
          ],
          borderWidth: 1,
        },
      ],
    }
    const ctx = this.barchart.nativeElement.getContext('2d');
    this.chartInstance=new Chart(ctx, {
      type: 'pie',
      data:data,
      options: {
        responsive: true,
      },
    });
  }
  


  groupByWeek(data: IncomeModel[]): { [week: string]: number } {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();  // Current month (0 - 11)
    const currentYear = currentDate.getFullYear();  // Current year
    const currentDayOfMonth = currentDate.getDate();  // Current day of the month
  
    // Calculate the current week of the current month
    const currentWeekNumber = Math.ceil(currentDayOfMonth / 7);
  
    // Filter data for the current month and current week
    const currentWeekData = data.filter(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === currentMonth &&  // Ensure the month matches
        itemDate.getFullYear() === currentYear &&  // Ensure the year matches
        Math.ceil(itemDate.getDate() / 7) === currentWeekNumber  // Ensure the week of the month matches
      );
    });
    // Group by the current week
    return currentWeekData.reduce((acc: { [week: string]: number }, curr) => {
      const week = `Week ${currentWeekNumber}`;  // Group all data under the current week number
      acc[week] = (acc[week] || 0) + parseFloat(curr.amount) || 0;
      return acc;
    }, {});
  }
  
  groupByMonth(data: IncomeModel[]): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();  // Get current year
    const currentMonth = currentDate.getMonth();   // Get current month (0 - 11)
  
    // Filter data to include only items from this year and this month
    const thisMonthData = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    });
  
    // Sum the amounts for this year and this month
    const totalAmountThisMonth = thisMonthData.reduce((acc, curr) => {
      return acc + (parseFloat(curr.amount)||0); // Sum the amounts
    }, 0);
    // console.log('totalAmountThisMonth: ', totalAmountThisMonth);
  
    return totalAmountThisMonth;
  }

  groupByYear(data: IncomeModel[]): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();  // Get current year
  
    // Filter data to include only items from this year
    const thisYearData = data.filter(item => {
      const itemDate = new Date(item.date);
      // console.log('thisYearData: ', thisYearData);/
      return itemDate.getFullYear() === currentYear;
    });
  
    // Sum the amounts for this year
    const totalAmountThisYear = thisYearData.reduce((acc, curr) => {
      return acc + (parseFloat(curr.amount) || 0); // Sum the amounts, ensure valid number
    }, 0);
    // console.log('totalAmountThisYear: ', totalAmountThisYear);
  
    return totalAmountThisYear; // Returns total amount for the current year
  }
  

  getDataByTimePeriod(): { income: number; expenses: number } {
    if (this.selectedTimePeriod === 'weekly') {
      const incomeByWeek = this.groupByWeek(this.incomeData);
      const expenseByWeek = this.groupByWeek(this.expenseData);
      const totalIncome = Object.values(incomeByWeek).reduce((acc, val) => acc + val, 0);
      const totalExpenses = Object.values(expenseByWeek).reduce((acc, val) => acc + val, 0);
      return { income: totalIncome, expenses: totalExpenses };
    } else if (this.selectedTimePeriod === 'monthly') {
      const incomeByMonth = this.groupByMonth(this.incomeData|| 0);
      const expenseByMonth = this.groupByMonth(this.expenseData|| 0 );

      return { income: incomeByMonth, expenses: expenseByMonth };
    } else {
      console.log("yearly");
      const incomeByYear = this.groupByYear(this.incomeData );
      const expenseByYear = this.groupByYear(this.expenseData );
      return { income: incomeByYear, expenses: expenseByYear };
    }
  }

  
  

}
