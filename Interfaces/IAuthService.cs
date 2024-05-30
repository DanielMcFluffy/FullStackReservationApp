using Database.DBModels;
using System.Security.Claims;

namespace Interfaces
{
    public interface IAuthService
    {
        public Task<string> GenerateToken(User user);

        //refresh token is also a jwt
        public Task<Tuple<string, DateTime>> GenerateRefreshToken();

        public ClaimsIdentity GenerateClaims(User user);

        public ClaimsIdentity GenerateClaims(string refreshKey);

        public Task<string> DecodeTokenClaimFromHeader(string claimType);

    }
}
