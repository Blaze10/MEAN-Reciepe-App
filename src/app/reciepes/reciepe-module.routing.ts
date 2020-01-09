import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReciepeListComponent } from './reciepe-list/reciepe-list.component';
import { ReciepeCreateComponent } from './reciepe-create/reciepe-create.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {path: '', component: ReciepeListComponent},
  {path: 'reciepe-create', component: ReciepeCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit-reciepe/:id', component: ReciepeCreateComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class ReciepeRoutingModule {}
