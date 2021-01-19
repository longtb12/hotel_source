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
using DataService.Data.Interfaces;
using DataService.Object.Request;
using DataService.Object.Model;

namespace ApiService.Controllers
{
    [Route("v1.0/loai-phong")]
    [ApiController]
    public class RoomTypeController : BaseController
    {
        private readonly IRoomTypeService _roomTypeService;
        public RoomTypeController(ILogger<RoomTypeController> logger, IMemoryCache memoryCache, IRoomTypeService roomTypeService) : base(logger, memoryCache)
        {
            _roomTypeService = roomTypeService;
        }
        [HttpPost("get-pading")]
        public async Task<IActionResult> GetPadingPoisition(TRequest<PaginationRequest> request)
        {
            var response = new Response<object>();
            try
            {
                var positions = await _roomTypeService.ListData(request.value.pageIndex, request.value.pageSize);
                var paging = Convert.ToDouble(positions.Total / request.value.pageSize);
                paging = (positions.Total % request.value.pageSize == 0 ? paging : paging + 1);
                var total_page = Math.Round(paging, MidpointRounding.AwayFromZero);
                return Ok(new
                {
                    success = true,
                    message = "",
                    listdata = positions,
                    total_page = total_page
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
                response.Data = await _roomTypeService.GetById(request.value);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save(TRequest<RoomTypeRequest> request)
        {
            if (request == null)
                return NotFound();
            var response = new Response<int>();
            try
            {
                if (request.value.Id == 0)
                {
                    response.Data = await _roomTypeService.Add(request.value);
                    response.Message = "Thêm thành công";
                    response.Success = true;
                }
                else
                {
                    response.Data = await _roomTypeService.Update(request.value);
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

        [HttpPost("deleted")]
        public async Task<IActionResult> Delete(TRequest<int> request)
        {
            var response = new Response<object>();
            try
            {
                response.Data = await _roomTypeService.Delete(request.value);
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
