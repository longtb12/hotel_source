using System;
using System.Collections.Generic;
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
    [Route("v1.0/chuc-nang")]
    [ApiController]
    public class FunctionController : BaseController
    {
        private readonly IFunctionService _functionService;
        public FunctionController(ILogger<FunctionController> logger, IMemoryCache memoryCache, IFunctionService functionService) : base(logger, memoryCache)
        {
            _functionService = functionService;
        }

        [HttpPost("chuc-nang-tree")]
        public async Task<IActionResult> LoadAllFunction(TRequest<RequesId> request)
        {
            var response = new Response<object>();
            try
            {
                var ListFunctionShowMenu = await _functionService.ListFunctionIsShowMenu();

                var ListAllFunction = await _functionService.ListAllFunction();

                var ObjectData = _functionService.BuildFancyTree(ListFunctionShowMenu, ListAllFunction);

                response.Success = true;
                response.Data = ObjectData;

                return Ok(new
                {
                    Success = response.Success,
                    Message = response.Message,
                    Data = ObjectData,
                    //DropDownList = districts.Select(c => new { Id = c.Id, Name = c.Name }).ToList()
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }


        [HttpPost("save-function")]
        public async Task<IActionResult> FunctionSave(TRequest<FunctionRequest> request)
        {
            if (request == null)
                return NotFound();
            var response = new Response<int>();
            try
            {
                if (request.value.Id == 0)
                {
                    response.Data = _functionService.Add(request.value);
                    response.Message = "Thêm thành công";
                    response.Success = true;
                }
                else
                {
                    response.Data = _functionService.Update(request.value);
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

        [HttpPost("get-function")]
        public async Task<IActionResult> GetFunctionById(TRequest<RequesId> request)
        {
            var response = new Response<object>();
            try
            {
                response.Data = await _functionService.GetById(request.value.Id);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("delete-function")]
        public async Task<IActionResult> DeleteFunctionById(TRequest<RequesId> request)
        {
            var response = new Response<int>();
            try
            {
                response.Data = await _functionService.Delete(request.value.Id);
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

        [HttpPost("droplist-function")]
        public async Task<IActionResult> DepartmentsDropdownlist(TRequest<RequesId> request)
        {
            var response = new Response<object>();
            try
            {
                var Functions = await _functionService.ListAllFunction();
                response.Data = _functionService.BuildDropDownlist(Functions, 1, 1);
                response.Success = true;
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
