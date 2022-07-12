import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackerRoutingModule } from './tracker-routing.module';
import { TrackerComponent } from './tracker.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    TrackerComponent
  ],
  imports: [
    CommonModule,
    TrackerRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    FlexLayoutModule,
    MatProgressSpinnerModule
  ]
})
export class TrackerModule { }
