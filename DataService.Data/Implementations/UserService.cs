using System;
using System.Collections.Generic;
using System.Text;
using DataServices.Interfaces;
using DataAccess.Repositories.Interfaces;
using DataServices.Object.Request;
using System.Threading.Tasks;
using DataServices.Object.Model;
using System.Linq;
using DataService.Object.Request;
using DataService.Object.Model;
using Libraries.Extensions;

namespace DataServices.Implementations
{
    public class UserService : BaseService, IUserServicecs
    {
        public UserService(IRepository repository) : base(repository)
        {
        }
        public async Task<int> QuickRegistration(UserQuickRegistrationRequest model)
        {
            return await _repository.ExecuteNonQuery("UserQuickRegistration", model);
        }

        public async Task<User> GetByUserName(string userName)
        {
            var data = await _repository.ExecuteReader<User>("UserGetByUserName", new { UserName = userName });
            return data.FirstOrDefault();
        }

        public async Task<List<User>> GetBydepartmentId(int DepartmentId)
        {
            return await _repository.ExecuteReader<User>("UserSelectByDepartmentId", new { DepartmentId = DepartmentId });
        }

        public async Task<int> Add(UserRequest model)
        {
            return await _repository.ExecuteNonQuery("UserAdd", new
            {
                DepartmentId = model.DepartmentId,
                PositionId = model.PositionId,
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.UserName,
                Password = model.Password,
                Gender = model.Gender,
                BirthOfDay = model.BirthOfDay,
                PhoneNumber = model.PhoneNumber,
                Email = model.Email,
                Address = model.Address,
                IDCard = model.IDCard,
                Status = model.Status,
                IsRoot = 0,
                CreatedUserId = 1
            });
        }
        public async Task<int> Update(UserRequest model)
        {
            return await _repository.ExecuteNonQuery("UserEdit", new
            {
                Id = model.Id,
                DepartmentId = model.DepartmentId,
                PositionId = model.PositionId,
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.UserName,
                Password = model.Password,
                Gender = model.Gender,
                BirthOfDay = model.BirthOfDay,
                PhoneNumber = model.PhoneNumber,
                Email = model.Email,
                Address = model.Address,
                IDCard = model.IDCard,
                Status = model.Status,
                IsRoot = 0,
                ModifiedUserId = 2
            });
        }

        public async Task<User> GetById(int Id)
        {
            var a = await _repository.ExecuteReader<User>("UserGetById", new { Id = Id });
            return a.FirstOrDefault();
        }

        public async Task<int> Delete(int Id)
        {
            return await _repository.ExecuteNonQuery("UserDelete", new { Id = Id });
        }

        public int AddEditActionOfUser(ActionOfUserAddRequest request)
        {
            return _repository.ExecuteNonQueryV2("ActionOfUserAddEdit", new
            {
                UserId = request.UserId,
                CreatedUserId = request.UserLoginId,
                Data1 = request.listAction.Select(c => new { Id = c }).ToList().ToDataTable()
            });
        }

        public List<object> BuildTreeV2(List<Function> functionals, int functionalId, int selectedId, List<ActionFunction> actions, List<ActionFunction> actionSelecteds)
        {
            return (from functional in functionals.Where(x => x.ParentId == 0 || x.Id == functionalId)
                    let existing = functionals.Count(x => x.ParentId == functional.Id) > 0 || (actions.Count(c => c.FunctionId == functional.Id) > 0)
                    select new
                    {
                        key = functional.Id,
                        icon = "icon-city icon-color",
                        title = functional.Name,
                        is_action = false,
                        id = functional.Id,
                        folder = existing,
                        active = (functional.Id == selectedId),
                        selected = false,
                        deleted = false,
                        children = existing ? BuildFunctionalChildrenV2(functionals, functional.Id, selectedId, actions, actionSelecteds) : new List<object>()
                    }).Cast<object>().ToList();
        }
        private List<object> BuildFunctionalChildrenV2(List<Function> functionals, int functionalId, int selectedId, List<ActionFunction> actions, List<ActionFunction> actionSelecteds)
        {
            var listReturn = new List<object>();
            //Add
            listReturn = actions.Where(c => c.FunctionId == functionalId).Select(m => new
            {
                key = m.Code,
                icon = "fancytree-icon",
                title = m.Name,
                folder = false,
                is_action = true,
                id = m.Id,
                active = false,
                selected = actionSelecteds.Count(v => v.Id == m.Id) > 0,
                deleted = actionSelecteds.Count(v => v.Id == m.Id) == 0,
                children = new List<object>()
            }).ToList<object>();


            listReturn.AddRange((from functional in functionals.Where(x => x.ParentId == functionalId)
                                 let existing = functionals.Count(x => x.ParentId == functional.Id) > 0 || actions.Count(c => c.FunctionId == functional.Id) > 0
                                 select new
                                 {
                                     key = functional.Id,
                                     icon = "icon-city icon-color",
                                     title = functional.Name,
                                     folder = existing,
                                     is_action = false,
                                     id = functional.Id,
                                     active = (functional.Id == selectedId),
                                     deleted = false,
                                     selected = false,
                                     children = existing ? BuildFunctionalChildrenV2(functionals, functional.Id, selectedId, actions, actionSelecteds) : new List<object>()
                                 }).Cast<object>().ToList());
            return listReturn;
        }
    }
}
