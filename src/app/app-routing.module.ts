import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CollegeDashboardComponent } from './components/college-dashboard/college-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'college-dashboard', pathMatch: 'full' },
  { path: 'college-dashboard', component: CollegeDashboardComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
