import { NgModule } from '@angular/core';

// angular material
import {
  MatSlideToggleModule,
  MatInputModule,
  MatRippleModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatListModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatSelectModule,
  MatRadioModule
} from '@angular/material';

// moment for datepicker
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  exports: [
    MatSlideToggleModule,
    MatInputModule,
    MatRippleModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelectModule,
    MatRadioModule
  ]
})
export class MaterialModule { }

