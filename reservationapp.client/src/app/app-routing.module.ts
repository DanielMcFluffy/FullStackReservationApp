import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { LoginComponent } from './login/login.component';
import { activateGuard } from './shared/activate.guard';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LandingComponent } from './landing/landing.component';
import { ListingDetailComponent } from './listing-detail/listing-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  {
    path: 'listing/:id',
    component: ListingDetailComponent,
  },
  { path: 'listing/:id/checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'list',
    //FOR DEVELOPMENT PURPOSES
    // canActivate: [activateGuard],
    component: ReservationListComponent,
    children: [{ path: ':username', component: ReservationListComponent }],
  },
  {
    path: 'new',
    canActivate: [activateGuard],
    component: ReservationFormComponent,
  },
  {
    path: 'edit/:id',
    canActivate: [activateGuard],
    component: ReservationFormComponent,
  },
  { path: '404NotFound', component: ErrorPageComponent },
  { path: '**', redirectTo: '404NotFound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
