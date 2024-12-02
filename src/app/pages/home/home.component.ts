import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IncomeModel } from '../../models/income.model';
import { Chart, registerables} from 'chart.js';
import { userModel } from '../../models/auth.model';
import { selectCurrentUser } from '../../redux/authentication.selector';
import { Store } from '@ngrx/store';
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
  currentUser:userModel=new Object() as userModel

  selectedTimePeriod: string = 'yearly';
  chartInstance:any = null;
  
  constructor(private store:Store) { }

  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
        this.incomeData = this.currentUser.Incomedetails as IncomeModel[]
        this.expenseData = this.currentUser.expensedetails as IncomeModel[]
        this.calculateTotals();
        this.checkAndRenderChart();
    })
  }

  checkAndRenderChart(): void {
    if (this.incomeData?.length > 0 && this.expenseData?.length > 0) {
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
      // Initialize filtered data
      let filteredData: { [category: string]: number } = {
        Rent: 0,
        Salary: 0,
        Groceries: 0,
        Transport: 0,
        Entertainment: 0,
        Food: 0,
        Health: 0,
        Other: 0
      };
  
      // Filter data based on the selected time period
      if (this.selectedTimePeriod === 'weekly') {
        // Example: Filter for weekly data
        const startOfWeek = this.getStartOfWeek(new Date());
        const endOfWeek = this.getEndOfWeek(new Date());
        this.incomeData.forEach(income => {
          const date = new Date(income.date)
         
          if (date >= startOfWeek && date <= endOfWeek) {
            const category = income.category;
            const amount = parseFloat(income.amount);
            if (category && !isNaN(amount)) {
              filteredData[category] = (filteredData[category] || 0) + amount;
            }
          }
        });
      
  
        // this.expenseData.forEach(expense => {
        //   const date = new Date(expense.date);
        //   if (date >= startOfWeek && date <= endOfWeek) {
        //     const category = expense.category;
        //     const amount = parseFloat(expense.amount);
        //     if (category && !isNaN(amount)) {
        //       filteredData[category] = (filteredData[category] || 0) - amount;
        //     }
        //   }
        // });
      } else if (this.selectedTimePeriod === 'monthly') {
        const currentMonth = new Date().getMonth();
        this.incomeData.forEach(income => {
          console.log(' this.incomeData: ',  this.incomeData);
          const date = new Date(income.date);
          if (date.getMonth() === currentMonth) {
            const category = income.category;
            const amount = parseFloat(income.amount);
            if (category && !isNaN(amount)) {
              filteredData[category] = (filteredData[category] || 0) + amount;
            }
          }
        });
  
        // this.expenseData.forEach(expense => {
        //   const date = new Date(expense.date);
        //   if (date.getMonth() === currentMonth) {
        //     const category = expense.category;
        //     const amount = parseFloat(expense.amount);
        //     if (category && !isNaN(amount)) {
        //       filteredData[category] = (filteredData[category] || 0) - amount;
        //     }
        //   }
        // });
      } else if (this.selectedTimePeriod === 'yearly') {
        const currentYear = new Date().getFullYear();
        this.incomeData.forEach(income => {
          const date = new Date(income.date);
          if (date.getFullYear() === currentYear) {
            const category = income.category;
            const amount = parseFloat(income.amount);
            if (category && !isNaN(amount)) {
              filteredData[category] = (filteredData[category] || 0) + amount;
            }
          }
        });
  
        this.expenseData.forEach(expense => {
          const date = new Date(expense.date);
          if (date.getFullYear() === currentYear) {
            const category = expense.category;
            const amount = parseFloat(expense.amount);
            if (category && !isNaN(amount)) {
              filteredData[category] = (filteredData[category] || 0) - amount;
            }
          }
        });
      }
  
      // Update the chart's data
      this.chartInstance.data.datasets[0].data = [
        filteredData['Rent'],
        filteredData['Salary'],
        filteredData['Groceries'],
        filteredData['Transport'],
        filteredData['Entertainment'],
        filteredData['Food'],
        filteredData['Health'],
        filteredData['Other']
      ];
      this.chartInstance.data.labels = Object.keys(filteredData).filter(category => filteredData[category]!== 0);
      this.chartInstance.data.datasets[0].backgroundColor = [
        'rgba(255, 99, 132, 0.6)',  // Rent
        'rgba(54, 162, 235, 0.6)',  // Salary
        'rgba(255, 159, 64, 0.6)',  // Groceries
        'rgba(75, 192, 192, 0.6)',  // Transport
        'rgba(153, 102, 255, 0.6)', // Entertainment
        'rgba(255, 205, 86, 0.6)',  // Food
        'rgba(201, 203, 207, 0.6)', // Health
        'rgba(255, 159, 132, 0.6)'  // Other
      ];
      // Re-render the chart
      this.chartInstance.update();
    }
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    const startOfWeek = new Date(date.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight
    return startOfWeek;
  }
  
  getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
    endOfWeek.setHours(23, 59, 59, 999); // Set time to end of the day (23:59:59.999)
    return endOfWeek;
  }
  
  
  initializeChart() {
    if(!this.barchart) return;
    if (this.chartInstance) {
      this.chartInstance.destroy(); // Destroy the existing chart instance
    }
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
      labels: Object.keys(categoryTotals).filter(category => categoryTotals[category]!== 0),
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
      console.log('acc: ', acc);
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
    const thisYearData = data?.filter(item => {
      const itemDate = new Date(item.date);
      // console.log('thisYearData: ', thisYearData);/
      return itemDate.getFullYear() === currentYear;
    });
  
    // Sum the amounts for this year
    const totalAmountThisYear = thisYearData?.reduce((acc, curr) => {
      return acc + (parseFloat(curr.amount) || 0); // Sum the amounts, ensure valid number
    }, 0);
    // console.log('totalAmountThisYear: ', totalAmountThisYear);
  
    return totalAmountThisYear; // Returns total amount for the current year
  }
  

  
  

}
