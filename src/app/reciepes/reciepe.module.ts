import { NgModule } from '@angular/core';
import { ReciepeCreateComponent } from './reciepe-create/reciepe-create.component';
import { ReciepeListComponent } from './reciepe-list/reciepe-list.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ReciepeRoutingModule } from './reciepe-module.routing';

@NgModule({
  declarations: [
    ReciepeCreateComponent,
    ReciepeListComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    ReciepeRoutingModule
  ]
})
export class ReciepeModule {}
