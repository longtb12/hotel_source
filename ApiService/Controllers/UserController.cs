using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using DataServices.Interfaces;
using DataServices.Object.Request;
using Libraries.Extensions;
using DataServices.Object.Model;
using DataServices.Object.Response;
using System.Libraries.Extensions;
using DataService.Object.Request;
using DataService.Data.Interfaces;

namespace ApiService.Controllers
{
    [Route("v1.0/nguoi-dung")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IUserServicecs _userService;
        private readonly IDepartmentService _departmentService;
        private readonly IPositionService _positionService;
        private readonly IFunctionService _functionService;
        public UserController(ILogger<UserController> logger, IMemoryCache memoryCache, IUserServicecs userServicecs,
            IDepartmentService departmentService, IPositionService positionService, IFunctionService functionService) : base(logger, memoryCache)
        {
            _userService = userServicecs;
            _departmentService = departmentService;
            _positionService = positionService;
            _functionService = functionService;
        }
        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok("User ok test");
        }

        [HttpPost("dang-ky-nhanh")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterQuickly(TRequest<UserQuickRegistrationRequest> request)
        {
            if (request == null)
                return NotFound();
            var response = new Response<int>();
            try
            {
                request.value.Password = request.value.Password.AsMd5();
                response.Data = await _userService.QuickRegistration(request.value);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }


        [HttpPost("dang-nhap")]
        [AllowAnonymous]
        public async Task<IActionResult> UserLogin(TRequest<UserLoginRequest> request)
        {
            if (request == null)
                return NotFound();
            var response = new Response<UserLoginResponse>();
            try
            {
                request.value.Password = request.value.Password.AsMd5();
                var data = await _userService.GetByUserName(request.value.UserName);
                if (data == null)
                {
                    response.Success = false;
                    response.Message = "Tên đăng nhập không tồn tại";
                    return Ok(response);
                }
                if (data.Password != request.value.Password)
                {
                    response.Success = false;
                    response.Message = "Mật khẩu không đúng";
                    return Ok(response);
                }
                if (data.Deleted.Value)
                {
                    response.Success = false;
                    response.Message = "Tài khoản đã bị xóa";
                    return Ok(response);
                }
                if (data.Status != 1)
                {
                    response.Success = false;
                    response.Message = "Tài khoản đã bị khóa";
                    return Ok(response);
                }
                HttpContext.Session.SetObjectAsJson("User", data);
                var deparmentId = HttpContext.Session.GetObjectFromJson<User>("User");
                var currentDateTime = DateTime.Now;
                var input = $"{data.Id};{data.UserName};{data.IsRoot};{currentDateTime};";
                var accessToken = input.AsSha256();
                var permission = await _functionService.GetActionByUserId(data.Id);
                response.Data = new UserLoginResponse
                {
                    User = data,
                    AccessToken = accessToken,
                    rights = permission.Select(c => c.Code).ToList()
                };
                response.Success = true;

            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("init")]
        //[AllowAnonymous]
        public async Task<IActionResult> Get(TRequest<UserDepartmentRequest> request)
        {
            var response = new Response<object>();
            try
            {
                var departments = await _departmentService.ListAllDepartmentbyUserId(request.value.DepartmentId, request.value.UserId);
                var tree = _departmentService.BuildFancyTree(departments.Where(c => c.IsUnit == true).ToList(), departments);
                var dropDownList = _departmentService.BuildDropDownlist(departments, 0, 0);
                var positions = await _positionService.ListData(1, 0);

                var users = await _userService.GetBydepartmentId(departments.FirstOrDefault().Id);
                return Ok(new
                {
                    success = true,
                    message = "",
                    departmentTree = tree,
                    dropDownList = dropDownList,
                    positions = positions,
                    users = users
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }


        [HttpPost("get-by-department-id")]
        public async Task<IActionResult> GetByDepartmentId(TRequest<int> request)
        {
            var response = new Response<object>();
            try
            {
                var users = await _userService.GetBydepartmentId(request.value);
                return Ok(new
                {
                    success = true,
                    message = "",
                    users = users
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("get-by-id")]
        public async Task<IActionResult> GetById(TRequest<int> request)
        {
            var response = new Response<object>();
            try
            {
                var user = await _userService.GetById(request.value);
                return Ok(new
                {
                    success = true,
                    message = "",
                    user = user
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("save-user")]
        public async Task<IActionResult> Save(TRequest<UserRequest> request)
        {
            if (request == null)
                return NotFound();
            var response = new Response<int>();
            try
            {
                if (request.value.Id == 0)
                {
                    request.value.Password = request.value.Password.AsMd5();
                    //response.Data = await _userService.Add(request.value);
                    var checkReturn = await _userService.Add(request.value);
                    switch (checkReturn)
                    {
                        case -1:
                            response.Message = "Tên đăng nhập đã tồn tại";
                            break;
                        case -2:
                            response.Message = "Email đã tồn tại";
                            break;
                        case -3:
                            response.Message = "Số CMT/Thẻ căn cước đã tồn tại";
                            break;
                        default:
                            break;
                    };
                    response.Data = request.value.DepartmentId;
                    response.Success = checkReturn > 0;
                }
                else
                {
                    var data = await _userService.GetById(request.value.Id);
                    if (data.Password != request.value.Password)
                    {
                        request.value.Password = request.value.Password.AsMd5();
                    }
                    //response.Data = await _userService.Update(request.value);
                    var checkReturn = await _userService.Update(request.value);
                    switch (checkReturn)
                    {
                        case -2:
                            response.Message = "Email đã tồn tại";
                            break;
                        case -3:
                            response.Message = "Số CMT/Thẻ căn cước đã tồn tại";
                            break;
                        default:
                            break;
                    };
                    response.Data = request.value.DepartmentId;
                    response.Success = checkReturn > 0;
                }

            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete(TRequest<int> request)
        {
            var response = new Response<object>();
            try
            {
                response.Data = await _userService.Delete(request.value);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("permission")]
        public async Task<IActionResult> ActionOfUser(TRequest<ActionOfUserRequest> request)
        {
            var response = new Response<object>();
            try
            {
                var functions = await _functionService.ListAllFunction();
                var actionOfUser = await _functionService.GetActionByUserId(request.value.UserLoginId);
                var actionOfUserAssign = await _functionService.GetActionByUserId(request.value.UserId);

                var tree = _userService.BuildTreeV2(functions, 0, 0, actionOfUser, actionOfUserAssign);
                return Ok(new
                {
                    success = true,
                    message = "",
                    tree = tree
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("add-permission")]
        public IActionResult AddEditActionOfUser(TRequest<ActionOfUserAddRequest> request)
        {
            var response = new Response<object>();
            try
            {
                response.Success = _userService.AddEditActionOfUser(request.value) >= 0;
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
