import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TrackerComponent } from "./modules/tracker/tracker.component";

const routes: Routes =[
  {
    path: '', redirectTo: 'tracker', pathMatch: 'full'
  },
  {
    path: 'tracker',
    component: TrackerComponent,
    loadChildren: () => import('./modules/tracker/tracker.module').then(mod => mod.TrackerModule),
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
