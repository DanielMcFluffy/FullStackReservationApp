import { createAction, props } from '@ngrx/store';
import { Reservation } from '../../shared/models/reservation';

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
