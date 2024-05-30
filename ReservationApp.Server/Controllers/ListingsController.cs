using Database.DBModels;
using Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ReservationApp.Server.Controllers
{
    [ApiController]
    [Route("listings")]
    public class ListingsController : ControllerBase
    {
        private readonly IListingsService _listingsService;

        public ListingsController(IListingsService listingsService)
        {
            _listingsService = listingsService;
        }

        //http requests
        [HttpGet]
        public async Task<List<Listing>> Get() =>
            await _listingsService.GetAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Listing>> Get(string id)
        {
            var listing = await _listingsService.GetAsync(id);

            if(listing == null)
            {
                return NotFound();
            }
            return listing;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post(Listing newListing)
        {
            await _listingsService.CreateAsync(newListing);

            return CreatedAtAction(nameof(Get), new { id = newListing.id });
        }
        //TODO: add a bulk write method -- refer to listingsService as well

        ////bulk write 
        //[HttpPost]

        //public async Task<IActionResult> Post(List<Listing> listings)
        //{
        //    await _listingsService.CreateBulkAsync(listings);

        //    return NoContent();
        //}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Listing updatedListing)
        {
            var listing = await _listingsService.GetAsync(id);

            if (listing == null)
            {
                return NotFound();
            }

            await _listingsService.UpdateAsync(id, updatedListing);

            return NoContent();
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var listing = await _listingsService.GetAsync(id);

            if(listing == null)
            {
                return NotFound();
            }

            await _listingsService.RemoveAsync(id);

            return NoContent();
        }


    }
}
