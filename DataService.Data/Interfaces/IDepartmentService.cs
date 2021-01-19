using DataServices.Object.Model;
using DataServices.Object.Request;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Interfaces
{
    public interface IDepartmentService
    {
        Task<int> Add(DepartmentRequest request);
        Task<int> Delete(int id);
        Task<int> Update(DepartmentRequest request);
        Task<Department> GetById(int id);
        Task<List<Department>> ListAllDepartment();
        List<object> BuildFancyTree(List<Department> Units, List<Department> Departments);
        Task<List<Department>> ListDepartmentUnit();
        List<object> BuildDropDownlist(List<Department> input, int departmentId, int value);
        Task<List<Department>> ListAllDepartmentbyUserId(int departmentId, int userId);
    }
}
