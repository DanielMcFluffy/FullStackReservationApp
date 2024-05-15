using Microsoft.AspNetCore.Mvc;
using ReservationApp.Server.Models;
using ReservationApp.Server.Services;

namespace ReservationApp.Server.Controllers
{
    [ApiController]
    [Route("listings")]
    public class ListingsController : ControllerBase
    {
        private readonly ListingsService _listingsService;

        public ListingsController(ListingsService listingsService)
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

        [HttpPost]
        public async Task<IActionResult> Post(Listing newListing)
        {
            await _listingsService.CreateAsync(newListing);

            return CreatedAtAction(nameof(Get), new { id = newListing.id });
        }

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
