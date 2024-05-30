namespace ReservationApp.Server.BaseModels.Requests
{
    public class UserRequest //the user only needs to type in these in for credentials
    {
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
    }
}
