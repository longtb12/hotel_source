using DataAccess.Repositories.Interfaces;
using DataServices.Interfaces;
using DataServices.Object.Model;
using DataServices.Object.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Implementations
{
    public class DepartmentService : BaseService, IDepartmentService
    {
        public DepartmentService(IRepository repository) : base(repository)
        {

        }

        public async Task<int> Add(DepartmentRequest request)
        {
            return await _repository.ExecuteNonQuery("DepartmentAdd", new { ParentId=request.ParentId,
                IsUnit=request.IsUnit,Acronym = request.Acronym,
                ShortName = request.ShortName,FullName = request.FullName,
                Status = 1,IsRoot=1,PhoneNumber = request.PhoneNumber,
                Email=request.Email,
                Address=request.Address,
                Description=request.Description,
                ActUserId = request.ActUserId
            });
        }

        public List<object> BuildFancyTree(List<Department> Units, List<Department> Departments)
        {
            return (from item in Units
                    select new
                    {
                        key = item.Id,
                        icon = "icon-archive icon-color",
                        title = item.FullName,
                        folder = true,
                        active = false,
                        children = BuildData(Departments, item.Id)
                    }).Cast<object>().ToList();
        }

        private List<object> BuildData(List<Department> Departments, int ParentId)
        {
            return (from item in Departments.Where(c => c.ParentId == ParentId)
                    select new
                    {
                        key = item.Id,
                        icon = "icon-folder4 icon-color",
                        title = item.FullName,
                        folder = false,
                        active = false,
                        children = BuildData(Departments, item.Id)
                    }).Cast<object>().ToList();
        }

        public async Task<List<Department>> ListAllDepartmentbyUserId(int departmentId,int userId)
        {
            return await _repository.ExecuteReader<Department>("DepartmentGetByUserId", new
            {
                UserId = userId,
                UnitId = departmentId
            });
        }
        public async Task<int> Delete(int id)
        {
            return await _repository.ExecuteNonQuery("DepartmentDelete", new { Id = id });
        }

        public async Task<Department> GetById(int id)
        {
            var data = await _repository.ExecuteReader<Department>("DepartmentGetById", new { Id = id });
            return data.FirstOrDefault();
        }

        public async Task<List<Department>> ListAllDepartment()
        {
            var data = await _repository.ExecuteReader<Department>("DepartmentAll", new { });
            return data;
        }

        public async Task<List<Department>> ListDepartmentUnit()
        {
            var data = await _repository.ExecuteReader<Department>("DepartmentUnit", new { });
            return data;
        }

        public async Task<int> Update(DepartmentRequest request)
        {
            return await _repository.ExecuteNonQuery("DepartmentUpdate", request);
        }

        public List<object> BuildDropDownlist(List<Department> input, int departmentId, int value)
        {
            var root = new List<object>();
            foreach (var department in input.Where(x => x.ParentId == 0 || x.Id == departmentId).OrderBy(x => x.SortOrder).ThenBy(x => x.FullName))
            {
                var node = new
                {
                    value = department.Id,
                    display_name = department.FullName,
                    selected = (department.Id == value)
                };
                root.Add(node);
                var existing = input.Count(x => x.ParentId == department.Id) > 0;
                if (existing)
                {
                    root = BuildDepartmentChildren(root, input, department.Id, "-- ", value);
                }
            }
            return root;
        }
        private List<object> BuildDepartmentChildren(List<object> root, List<Department> input, int departmentId, string prefix, int value)
        {
            foreach (var department in input.Where(x => x.ParentId == departmentId).OrderBy(x => x.SortOrder).ThenBy(x => x.FullName))
            {
                var node = new
                {
                    value = department.Id,
                    display_name = $"{prefix}{department.FullName}",
                    selected = (department.Id == value)
                };
                root.Add(node);
                var existing = input.Count(x => x.ParentId == department.Id) > 0;
                if (existing)
                {
                    root = BuildDepartmentChildren(root, input, department.Id, $"{prefix.Trim()}-- ", value);
                }
            }
            return root;
        }
    }
}
