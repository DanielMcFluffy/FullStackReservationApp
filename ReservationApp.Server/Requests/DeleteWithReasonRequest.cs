namespace ReservationApp.Server.Requests
{
    public class DeleteWithReasonRequest //this class will map our request object from the front-end to be passed to the controller 
    {
        public string listing_id { get; set; } = null!;
        public string? reasoncancel { get; set; }
    }
}
