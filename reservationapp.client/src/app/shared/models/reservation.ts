export interface Reservation {
  id?: number;
  checkindate: Date;
  checkoutdate: Date;
  guestname?: string;
  guestemail?: string;
  listing_id: number;
  userId?: string | number;
  reasonCancel?: string;
  token?: string | number;
  listingDetails?: any;
}
