using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ReservationApp.Server.Models;
using ReservationApp.Server.Requests;
using ReservationApp.Server.Services;
using System.Security.Cryptography;
using BC = BCrypt.Net.BCrypt;
namespace ReservationApp.Server.Controllers
{


    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UsersService _usersService;
        private readonly AuthService _authService;

        public UsersController(UsersService usersService,
            AuthService authService)
        {
            _usersService = usersService;
            _authService = authService;
        }

        //http requests
        [HttpGet("/users")]
        public async Task<List<User>> Get() =>
            await _usersService.GetAsync();

        [HttpGet("/users/{id}")]
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _usersService.GetAsync(id);

            if(user == null)
            {
               var errorResponse = new { Message = "User does not exist" };

                return NotFound(errorResponse);
            }
            return user;

        }

        //signup
        [HttpPost("/register")] //this is for registration without auth0
        public async Task<ActionResult<User>> Register(UserRequest request)
        {
            var existingUser = await _usersService.GetByUsernameAsync(request.username);

            if(existingUser != null)
            {
                var errorResponse = new { Message = "Email has previously registered an account!" };
                return BadRequest(errorResponse);
            }

            var hashPassword = BC.HashPassword(request.password);//bcrypt the password

            var userData = new User()
            {
                username = request.username,
                password = hashPassword,
                datecreated = DateTime.UtcNow,
            };

            await _usersService.CreateAsync(userData);
            var successResponse = new { Success = true, UserRegistered = userData };

            return CreatedAtAction(nameof(Register), successResponse);

        }

        [HttpPost("/login")]
        public async Task<IActionResult> Login(UserRequest request)
        {
            //we first check if the account exists or not
            var existingUser = await _usersService.GetByUsernameAsync(request.username);

            //we check if the password matches
            var passwordMatches = BC.Verify(request.password, existingUser.password);

            if (existingUser == null || !passwordMatches)
            {
                var errorResponse = new { Message = "Incorrect credentials!" };

                return BadRequest(errorResponse);

            } 
                //we first generate the refreshtoken
                var refreshTokenInfo = await _authService.GenerateRefreshToken(); //we get a tuple

                //then we insert this token into the database by updating the existing user's info
                var userWithRefreshToken = new User()
                {
                    id = existingUser.id,
                    uid = existingUser.uid,
                    username = existingUser.username,
                    password = existingUser.password,
                    datecreated = existingUser.datecreated,
                    refreshtoken = refreshTokenInfo.Item1, //the refreshtoken
                    tokenexpires = refreshTokenInfo.Item2 //the expiry for refreshtoken
                };
                await _usersService.UpdateAsync(existingUser.id!, userWithRefreshToken);

                //we then generate the accesstoken
                var accessToken = await _authService.GenerateToken(userWithRefreshToken);

                var authData = new
                {   Message = "Login successful",
                    refreshToken = refreshTokenInfo.Item1,
                    token = accessToken,
                };

            return Ok(authData);
        }

        //[Authorize]
        //[HttpGet("/signin")]
        //public async Task<IActionResult> SignIn()
        //{
        //    var SuccessMessage = new {Message = "success"};

        //    return Ok(SuccessMessage);
        //}

        //[HttpPost("/authenticate")] //this endpoint provides token //ideally move this logic into the body of the signin function
        //public async Task<IActionResult> Authenticate(User user)
        //{
        //    if (user == null)
        //    {
        //        var errorResponse = new { Message = "Error not found" };

        //        return NotFound(errorResponse);
        //    }

        //    var token = await _authService.GenerateToken(user);
        //    return Ok(token);

        //}

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _usersService.GetAsync(id);

            if(user == null)
            {
                return NotFound();
            }

            await _usersService.RemoveAsync(id);

            return NoContent();
        }


    }
}
