using Database.DBModels;

namespace Interfaces
{
    public interface IListingsService
    {
        Task<List<Listing>> GetAsync();
        Task<Listing?> GetAsync(string id);
        Task CreateAsync(Listing newListing);
        //TODO: add a bulk write method -- refer to listingsController as well

        //public async Task CreateBulkAsync(List<Listing> listings)
        //{
        //    await _listingCollection.InsertManyAsync(listings);
        //}

        Task UpdateAsync(string id, Listing updatedListing);
        Task RemoveAsync(string id);


    }
}
