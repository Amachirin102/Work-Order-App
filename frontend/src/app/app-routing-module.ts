import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'workorders',
    loadComponent: () =>
      import('./components/work-order-list/work-order-list').then((m) => m.WorkOrderList),
  },
  {
    path: 'workorders/new',
    loadComponent: () =>
      import('./components/work-order-form/work-order-form').then((m) => m.WorkOrderForm),
  },
  {
    path: 'workorders/edit/:id',
    loadComponent: () =>
      import('./components/work-order-form/work-order-form').then((m) => m.WorkOrderForm),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
