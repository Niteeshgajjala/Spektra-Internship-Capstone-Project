import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserGuard } from './auth/user.guard';
import { AdminGuard } from './auth/admin.guard';
import { TrackExpensesComponent } from './track-expenses/track-expenses.component';
import { TrackBudgetComponent } from './budget-pool/budget-pool.component';
import { ContributionsComponent } from './contributions/contributions.component';
import { CategoryComponent } from './category/category.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ViewBudgetPoolsComponent } from './view-budget-pools/view-budget-pools.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { UserReportsComponent } from './user-reports/user-reports.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: 'set-budgets',
        loadComponent: () =>
          import('./set-budgets/set-budgets.component').then(m => m.SetBudgetsComponent),
      },
      { path: 'expenses', component: TrackExpensesComponent },
      { path: 'contributions', component: ContributionsComponent },
      { path: 'budget-pool', component: TrackBudgetComponent },
      {
  path: 'user-reports',
  loadComponent: () =>
    import('./user-reports/user-reports.component').then(m => m.UserReportsComponent)
}
    ]
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'categories', component: CategoryComponent },
      // Future additions: users, pools, insights
      {path:'manage-users',component:ManageUsersComponent},
      {path:'view-budget-pools',component:ViewBudgetPoolsComponent},
      {path:'admin-reports',component:AdminReportsComponent},
    

    ]
  },
  


  { path: '**', redirectTo: 'login' }
];
