using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using ReservationApp.Server.Models;

namespace ReservationApp.Server.Services
{
    public class UsersService
    {
        private readonly IMongoDatabase _database; //the singleton db entity that will be injected from the cosntructor
        private readonly IMongoCollection<User> _userCollection; //we then inject the collection that is obtained from the IMongoDatabase DI
        
        public UsersService(
            IMongoDatabase database)
        {
           _database = database; //initialize

            _userCollection = _database.GetCollection<User>(
                "Users"); //initialize
        }
        //get all users
        public async Task<List<User>> GetAsync() =>
            await _userCollection.Find(_ => true).ToListAsync();
        //get singular user
        public async Task<User> GetAsync(string id) =>
            await _userCollection.Find(x => x.id == id).FirstOrDefaultAsync();
        //get user via username(email)
        public async Task<User> GetByUsernameAsync(string username) =>
            await _userCollection.Find(x => x.username == username).FirstOrDefaultAsync();


        public async Task CreateAsync(User newUser) =>
            await _userCollection.InsertOneAsync(newUser);
        public async Task UpdateAsync(string id, User updatedUser) =>
            await _userCollection.ReplaceOneAsync(x => x.id == id, updatedUser);
        public async Task RemoveAsync(string id) =>
            await _userCollection.DeleteOneAsync(x => x.id == id);
    }
}
