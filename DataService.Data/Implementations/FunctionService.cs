using DataAccess.Repositories.Interfaces;
using DataService.Object.Model;
using DataServices.Interfaces;
using DataServices.Object.Model;
using DataServices.Object.Request;
using Libraries.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DataServices.Implementations
{
    public class FunctionService : BaseService, IFunctionService
    {
        public FunctionService(IRepository repository) : base(repository)
        {
        }

        public List<object> BuildFancyTree(List<Function> ListFunctionShowMenu, List<Function> ListAllFunction)
        {
            return (from item in ListFunctionShowMenu
                    select new
                    {
                        key = item.Id,
                        icon = "icon-archive icon-color",
                        title = item.Name,
                        folder = true,
                        active = false,
                        children = BuildData(ListAllFunction, item.Id)
                    }).Cast<object>().ToList();
        }

        private List<object> BuildData(List<Function> ListAllFunction, int FunctionShowMenuId)
        {
            return (from item in ListAllFunction.Where(c => c.ParentId == FunctionShowMenuId)
                    select new
                    {
                        key = item.Id,
                        icon = "icon-folder4 icon-color",
                        title = item.Name,
                        folder = false,
                        active = false,
                        children = BuildData(ListAllFunction, item.Id)
                    }).Cast<object>().ToList();
        }

        public Task<List<ActionFunction>> GetActionByUserId(int Id)
        {
            return _repository.ExecuteReader<ActionFunction>("ActionGetByUserId", new { UserId = Id });
        }

        public int Add(FunctionRequest request)
        {
            var objreturn = _repository.ExecuteScalarV2("FunctionAdd", new
            {
                //ParentId = request.ParentId,
                //Name = request.Name,
                //Icon = request.Icon,
                //ActionLink = request.ActionLink,
                //Status = request.Status,
                //ShowInMenu = request.ShowInMenu,
                //Description = request.Description,
                //ActUserId = request.ActUserId,
                //Actions = request.Actions.Any() ? JsonSerializer.Serialize(request.Actions) : null
                ParentId = request.ParentId,
                Name = request.Name,
                Icon = request.Icon,
                ActionLink = request.ActionLink,
                SortOrder = 1,
                Status = request.Status,
                ShowInMenu = request.ShowInMenu,
                Description = request.Description,
                level = 1,
                CreatedUserId = 1,
                Data = request.Actions.Select(c => new {
                    Id = c.Id,
                    Name = c.Name,
                    ControllerName = c.ControllerName,
                    ActionName = c.ActionName,
                    Method = c.Method
                }).ToList().ToDataTable()
            });
            return (int)objreturn;
        }

        public async Task<int> Delete(int id)
        {
            var obj = await _repository.ExecuteScalar("FunctionDelete", new { Id = id });
            return (int)obj;
        }

        public async Task<object> GetById(int id)
        {
            var data = await _repository.ExecuteReader<Function>("FunctionGetById", new { Id = id });
            var dataActions = await _repository.ExecuteReader<ActionRequest>("ActionsByIdFunction", new { Id = id });
            return new
            {
                FunctionData = data.FirstOrDefault(),
                Actions = dataActions
            };
        }

        public async Task<List<Function>> ListAllFunction()
        {
            var data = await _repository.ExecuteReader<Function>("FunctionAll", new { });
            return data;
        }

        public async Task<List<Function>> ListFunctionIsShowMenu()
        {
            var data = await _repository.ExecuteReader<Function>("FunctionIsShowInMenu", new { });
            return data;
        }

        public int Update(FunctionRequest request)
        {
            var result = _repository.ExecuteScalarV2("FunctionUpdate", new
            {
                //Id = request.Id,
                //ParentId = request.ParentId,
                //Name = request.Name,
                //Icon = request.Icon,
                //ActionLink = request.ActionLink,
                //Status = request.Status,
                //ShowInMenu = request.ShowInMenu,
                //Description = request.Description,
                //ActUserId = request.ActUserId,
                //Actions = request.Actions.Any() ? JsonSerializer.Serialize(request.Actions) : null
                Id = request.Id,
                ParentId = request.ParentId,
                Name = request.Name,
                Icon = request.Icon,
                ActionLink = request.ActionLink,
                SortOrder = 1,
                Status = request.Status,
                ShowInMenu = request.ShowInMenu,
                Description = request.Description,
                Level = 1,
                ModifiedUserId = 1,
                Data = request.Actions.Select(c => new {
                    Id = c.Id,
                    Name = c.Name,
                    ControllerName = c.ControllerName,
                    ActionName = c.ActionName,
                    Method = c.Method
                }).ToList().ToDataTable()
            });
            return (int)result;
        }

        public List<object> BuildDropDownlist(List<Function> input, int FunctionId, int value)
        {
            var root = new List<object>();
            foreach (var Function in input.Where(x => x.ParentId == 0 || x.Id == FunctionId).OrderBy(x => x.SortOrder).ThenBy(x => x.Name))
            {
                var node = new
                {
                    value = Function.Id,
                    display_name = Function.Name,
                    selected = (Function.Id == value)
                };
                root.Add(node);
                var existing = input.Count(x => x.ParentId == Function.Id) > 0;
                if (existing)
                {
                    root = BuildFunctionChildren(root, input, Function.Id, "-- ", value);
                }
            }
            return root;
        }

        private List<object> BuildFunctionChildren(List<object> root, List<Function> input, int FunctionId, string prefix, int value)
        {
            foreach (var Function in input.Where(x => x.ParentId == FunctionId).OrderBy(x => x.SortOrder).ThenBy(x => x.Name))
            {
                var node = new
                {
                    value = Function.Id,
                    display_name = $"{prefix}{Function.Name}",
                    selected = (Function.Id == value)
                };
                root.Add(node);
                var existing = input.Count(x => x.ParentId == Function.Id) > 0;
                if (existing)
                {
                    root = BuildFunctionChildren(root, input, Function.Id, $"{prefix.Trim()}-- ", value);
                }
            }
            return root;
        }
    }
}
