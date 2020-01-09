import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatFormFieldModule, MatInputModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatSelectModule, MatDividerModule,
  MatProgressBarModule, MatPaginatorModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  exports: [
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule { }
