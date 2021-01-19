using DataService.Object.Model;
using DataService.Object.Request;
using DataServices.Object.Model;
using DataServices.Object.Request;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IUserServicecs
    {
        public Task<int> QuickRegistration(UserQuickRegistrationRequest model);

        public Task<User> GetByUserName(string userName);
        Task<List<User>> GetBydepartmentId(int DepartmentId);
        Task<User> GetById(int Id);
        Task<int> Add(UserRequest model);
        Task<int> Update(UserRequest model);
        Task<int> Delete(int Id);
        int AddEditActionOfUser(ActionOfUserAddRequest request);
        List<object> BuildTreeV2(List<Function> functionals, int functionalId, int selectedId, List<ActionFunction> actions, List<ActionFunction> actionSelecteds);
    }
}
