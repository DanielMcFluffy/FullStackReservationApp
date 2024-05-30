using Database.DBModels;
using Interfaces;
using MongoDB.Driver;

namespace Services.Services
{
    public class ListingsService : IListingsService
    {
        private readonly IMongoDatabase _database; //the singleton db entity that will be injected from the cosntructor
        private readonly IMongoCollection<Listing> _listingCollection; //we then inject the collection that is obtained from the IMongoDatabase DI

        public ListingsService(
            IMongoDatabase database)
        {
            _database = database; //initialize

            _listingCollection = _database.GetCollection<Listing>(
                "Listings"); //initialize
        }

        public async Task<List<Listing>> GetAsync() =>
            await _listingCollection.Find(_ => true).ToListAsync();
        public async Task<Listing?> GetAsync(string id) =>
            await _listingCollection.Find(x => x.id == id).FirstOrDefaultAsync();
        public async Task CreateAsync(Listing newListing) =>
            await _listingCollection.InsertOneAsync(newListing);
        //TODO: add a bulk write method -- refer to listingsController as well

        //public async Task CreateBulkAsync(List<Listing> listings)
        //{
        //    await _listingCollection.InsertManyAsync(listings);
        //}

        public async Task UpdateAsync(string id, Listing updatedListing) =>
            await _listingCollection.ReplaceOneAsync(x => x.id == id, updatedListing);
        public async Task RemoveAsync(string id) =>
            await _listingCollection.DeleteOneAsync(x => x.id == id);
    }
}
