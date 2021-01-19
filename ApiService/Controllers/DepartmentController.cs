using System;
using System.Collections.Generic;
using System.Libraries.Extensions;
using System.Linq;
using System.Threading.Tasks;
using DataServices.Interfaces;
using DataServices.Object.Request;
using Libraries.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace ApiService.Controllers
{
    [Route("v1.0/phong-ban")]
    [ApiController]
    public class DepartmentController : BaseController {
        private readonly IDepartmentService _departmentService;
        public DepartmentController(ILogger<DepartmentController> logger, IMemoryCache memoryCache, IDepartmentService departmentService) : base(logger, memoryCache)
        {
            _departmentService = departmentService;
        }


        [HttpPost("save-department")]
        public async Task<IActionResult> AddDepartment(TRequest<DepartmentRequest> request)
        {
            if (request == null)
                return NotFound();
            var response = new Response<int>();
            try
            {
                if (request.value.Id == 0)
                {
                    response.Data = await _departmentService.Add(request.value);
                    response.Message = "Thêm thành công";
                    response.Success = true;
                }
                else
                {
                    response.Data = await _departmentService.Update(request.value);
                    response.Message = "Sửa thành công";
                    response.Success = true;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("delete-department")]
        public async Task<IActionResult> DeleteDepartment(TRequest<RequesId> request)
        {
            var response = new Response<int>();
            try
            {
                response.Data = await _departmentService.Delete(request.value.Id);
                response.Message = "Xóa thành công";
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("get-department")]
        public async Task<IActionResult> GetDepartmentById(TRequest<RequesId> request)
        {
            var response = new Response<object>();
            try
            {
                response.Data = await _departmentService.GetById(request.value.Id);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("list-department")]
        public async Task<IActionResult> Departments(TRequest<RequesId> request)
        {
            var response = new Response<object>();
            try
            {
                response.Data = await _departmentService.ListAllDepartment();
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("droplist-department")]
        public async Task<IActionResult> DepartmentsDropdownlist(TRequest<RequesId> request)
        {
            var response = new Response<object>();
            try
            {
                var Department = await _departmentService.ListAllDepartment();
                response.Data = _departmentService.BuildDropDownlist(Department,13,13);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("tree-department")]
        public async Task<IActionResult> LoadTreeDepartment(TRequest<RequesId> request)
        {
            var response = new Response<object>();
            try
            {
                var DepartmentUnit = await _departmentService.ListDepartmentUnit();

                var Department = await _departmentService.ListAllDepartment();

                var TreeDepartment = _departmentService.BuildFancyTree(DepartmentUnit, Department);

                response.Success = true;
                response.Data = TreeDepartment;

                return Ok(new
                {
                    Success = response.Success,
                    Message = response.Message,
                    Data = TreeDepartment,
                    //DropDownList = DepartmentUnit.Select(c => new { Id = c.Id, FullName = c.FullName }).ToList()
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }
    }
}
