import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ReservationModule } from './reservation/reservation.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RegisterComponent } from './register/register.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { LandingComponent } from './landing/landing.component';
import { SearchBarComponent } from './header/search-bar/search-bar.component';
import { ProfileControlComponent } from './header/profile-control/profile-control.component';
import { ListingItemComponent } from './landing/listing-item/listing-item.component';
import { ListingDetailComponent } from './listing-detail/listing-detail.component';
import { NgArrayPipesModule } from 'ngx-pipes';

// angular MAT calendar imports

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarComponent } from './features/calendar/calendar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CheckoutComponent } from './checkout/checkout.component';
import { StoreModule } from '@ngrx/store';
import { checkoutReducer } from './features/store/checkout-reducer';
import { DeletePopupComponent } from './reservation-list/delete-popup/delete-popup.component';
import { ImageModalComponent } from './listing-detail/image-modal/image-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    ErrorPageComponent,
    LandingComponent,
    SearchBarComponent,
    ProfileControlComponent,
    ListingItemComponent,
    ListingDetailComponent,
    CalendarComponent,
    CheckoutComponent,
    DeletePopupComponent,
    ImageModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReservationModule,
    HomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    NgArrayPipesModule,
    StoreModule.forRoot({ checkout: checkoutReducer }),

    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'hotel-app-a2b0b',
        appId: '1:282751931092:web:9717fca6f8dbdaeef9a141',
        storageBucket: 'hotel-app-a2b0b.appspot.com',
        apiKey: 'AIzaSyD9m_3nlaRpk5rJh7ARn340ObD77ZhjQQ0',
        authDomain: 'hotel-app-a2b0b.firebaseapp.com',
        messagingSenderId: '282751931092',
      })
    ),
    provideAuth(() => getAuth()),
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
