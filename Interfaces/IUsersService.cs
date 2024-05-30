using Database.DBModels;

namespace Interfaces
{
    public interface IUsersService
    {
        //get all users
        public Task<List<User>> GetAsync();
        //get singular user
        public Task<User> GetAsync(string id);
        //get user via username(email)
        public Task<User> GetByUsernameAsync(string username);
        public Task CreateAsync(User newUser);
        public Task UpdateAsync(string id, User updatedUser);
        public Task RemoveAsync(string id);
    }
}
