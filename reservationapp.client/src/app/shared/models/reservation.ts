export interface Reservation {
  id?: string;
  listing_id: string;
  guestname?: string;
  guestemail?: string;
  checkindate: Date;
  checkoutdate: Date;
  userId?: string;
  reasonCancel?: string;
  token?: string | number;
  listingDetails?: any;
}
