import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReciepeCreateComponent } from './reciepes/reciepe-create/reciepe-create.component';
import { ReciepeListComponent } from './reciepes/reciepe-list/reciepe-list.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {path: '', component: ReciepeListComponent},
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
