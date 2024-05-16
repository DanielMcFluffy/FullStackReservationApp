import { createReducer, on } from '@ngrx/store';
import {
  addToCart,
  editCart,
  payloadListing,
  removeFromCart,
  resetCart,
} from './checkout-actions';
import { Reservation } from '../../shared/models/reservation';

//the structure of the checkout state (export so we can assign this interface to the store later)
export interface CheckoutState {
  addedReservation: Reservation | null;
  listingData: payloadListing | null;
  status: string;
}

export const initialState: CheckoutState = {
  addedReservation: null,
  listingData: null,
  status: 'pending',
};

export const checkoutReducer = createReducer(
  //set initial state
  initialState,
  on(addToCart, (state, { reservation, listing }) => ({
    ...state,
    addedReservation: reservation,
    listingData: listing,
  })),
  on(editCart, (state, { newCheckInDate, newCheckOutDate }) => {
    // Check if there is already a reservation to edit
    if (!state.addedReservation) {
      // Optionally, handle the error state or return the unchanged state
      return state;
    }
    return {
      ...state,
      addedReservation: {
        ...state.addedReservation,
        checkindate: newCheckInDate,
        checkoutdate: newCheckOutDate,
      },
    };
  }),
  on(removeFromCart, (state) => ({
    ...state,
    addedReservation: null,
  })),
  on(resetCart, (state) => ({
    totalDays: 0,
    subtotalDays: 0,
    total: 0,
    addedReservation: null,
    listingData: null,
    status: 'pending',
  }))
);
