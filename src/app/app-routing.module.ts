import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { TransferComponent } from './transfer/transfer.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'customer',component:CustomerComponent},
  {path:'transfer/:id',component:TransferComponent},
  {path:'history',component:HistoryComponent},
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'**',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
