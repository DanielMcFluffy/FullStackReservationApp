import { createAction, props } from '@ngrx/store';
import { Reservation } from '../../shared/models/reservation';

//TODO:
//refactor how this interface will be used between listing-detail/checkout/state-management system as it is being used in the Reservation interface and also as a parameter to be passed into the below addToCart reducer
//ideally make it pass as 1 parameter instead of 2 as reservation should carry that information 
export interface payloadListing {
  id: string;
  title: string;
  price: number;
  description: string;
  image1: string;
}

export const addToCart = createAction(
  '[Listing Detailed Component] Add To Cart',
  props<{
    reservation: Reservation;
    listing: payloadListing;
  }>()
);

export const editCart = createAction(
  '[Listing Checkout Component] Edit Cart Details',
  props<{
    newCheckInDate: Date;
    newCheckOutDate: Date;
  }>()
);

export const removeFromCart = createAction(
  '[Listing Detailed Component] Remove From Cart'
);

export const resetCart = createAction(
  '[Listing Detailed Component] Reset Cart'
);
