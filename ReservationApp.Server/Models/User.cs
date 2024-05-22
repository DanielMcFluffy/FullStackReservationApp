using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ReservationApp.Server.Models
{
    [BsonIgnoreExtraElements] //add this if you're using mongodb atlas to store data -- on atlas db, we have an additional objectid field so this attribute ignores that and maps our models accurately
    public class User
    {
        [BsonId] //this defines the Id -- it will make it a primary key
        [BsonRepresentation(BsonType.ObjectId)] //converts the parameter type from ObjectId to string

        // properties with * will need be passed their values somehow from the front-end (state management?)
        public string? id { get; set; } = null!; //* will need to pass this to reservations collection
        public string? uid { get; set; } //* will need to pass this to reservations collection
        public string username { get; set; } = null!; //* will need to pass this to reservations collection

        public string password { get; set; } = null!; //raw password will be bcrypted instead
        public string? refreshtoken { get; set; }
        public DateTime? tokenexpires { get; set; }
        public DateTime? datecreated { get; set; } = DateTime.UtcNow;
        //public string[]? Roles { get; set; }


    }
}
