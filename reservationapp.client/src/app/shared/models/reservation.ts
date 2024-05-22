import { payloadListing } from '../../features/store/checkout-actions';

export interface Reservation {
  id?: string;
  listing_id: string;
  guestname?: string;
  guestemail?: string;
  checkindate: Date;
  checkoutdate: Date;
  user_id?: string;
  reasonCancel?: string;
  listingDetails?: payloadListing | null; //this should contain details about listing such as img url, etc
}
