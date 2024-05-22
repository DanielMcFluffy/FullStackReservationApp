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

        //[HttpGet("/users")]
        //public async Task<List<User>> Get() =>
        //    await _usersService.GetAsync();

        //[HttpGet("/users/{id}")]
        //public async Task<ActionResult<User>> Get(string id)
        //{
        //    var user = await _usersService.GetAsync(id);

        //    if(user == null)
        //    {
        //       var errorResponse = new { Message = "User does not exist" };

        //        return NotFound(errorResponse);
        //    }
        //    return user;

        //}

        //signup
        [HttpPost("/register")] //this is for registration without auth0
        public async Task<ActionResult<User>> Register(UserRequest request)
        {
            var existingUser = await _usersService.GetByUsernameAsync(request.username);

            if(existingUser != null)
            {
                var errorResponse = new { message = "Email has previously registered an account!" };
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
        public async Task<IActionResult> Login([FromBody] UserRequest request)
        {
            //we first check if the account exists or not
            var existingUser = await _usersService.GetByUsernameAsync(request.username);

            //we check if the password matches
            var passwordMatches = BC.Verify(request.password, existingUser.password);

            if (existingUser == null || !passwordMatches)
            {
                var errorResponse = new { message = "Incorrect credentials!" };

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
                {   message = "Login successful",
                    refreshToken = refreshTokenInfo.Item1,
                    token = accessToken,
                };

            return Ok(authData);
        }

        [HttpGet("/access")]
        public async Task<IActionResult> GenerateUserAccessToken()
        {
            var user_id = await _authService.DecodeTokenClaimFromHeader("user_id"); //get the user_id from the token

            var userData = await _usersService.GetAsync(user_id);

            if (userData == null)
            {
                var errorResponse = new { message = "User does not exist" };

                return NotFound(errorResponse);
            }

            //check if the refreshtoken is still valid

            if (DateTime.UtcNow > userData.tokenexpires)
            {
                var errorResponse = new { message = "Refresh token has expired" };

                return BadRequest(errorResponse);
            }

            //generate a new accesstoken

            var accessToken = await _authService.GenerateToken(userData);

            var authData = new
            {
                message = "Access token generated",
                token = accessToken,
            };

           return Ok(authData);
        }

        [Authorize]
        [HttpGet("/refresh")]
        public async Task<IActionResult> GenerateUserRefreshToken()
        {

            var user_id = await _authService.DecodeTokenClaimFromHeader("user_id"); //get the user_id from the token
            
            var refreshTokenInfo =  await _authService.GenerateRefreshToken(); //generate a new refreshtoken

            var user = await _usersService.GetAsync(user_id); //get the user

            var userWithNewRefreshToken = new User()
            {
                id = user.id,
                uid = user.uid,
                username = user.username,
                password = user.password,
                datecreated = user.datecreated,
                refreshtoken = refreshTokenInfo.Item1, //the refreshtoken
                tokenexpires = refreshTokenInfo.Item2 //the expiry for refreshtoken
            };

            await _usersService.UpdateAsync(user_id, userWithNewRefreshToken); //update the user with the new refreshtoken

            var authData = new
            {
                message = "Refresh token generated",
                refreshToken = refreshTokenInfo.Item1,
            };

            return Ok(authData);
        }

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
