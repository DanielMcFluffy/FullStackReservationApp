namespace ReservationApp.Server.Models
{    //this class is used to store the appsettings.json file's BookStoreDatabase property values
    public class ReservationDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string[] ReservationCollectionNames { get; set; } = null!;
    }
}
