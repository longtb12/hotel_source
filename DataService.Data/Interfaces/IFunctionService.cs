using DataService.Object.Model;
using DataServices.Object.Model;
using DataServices.Object.Request;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IFunctionService
    {
        int Add(FunctionRequest request);
        Task<int> Delete(int id);
        int Update(FunctionRequest request);
        Task<object> GetById(int id);
        Task<List<Function>> ListFunctionIsShowMenu();
        Task<List<Function>> ListAllFunction();
        List<object> BuildFancyTree(List<Function> ListFunctionShowMenu, List<Function> ListAllFunction);
        List<object> BuildDropDownlist(List<Function> input, int FunctionId, int value);
        Task<List<ActionFunction>> GetActionByUserId(int Id);
    }
}
