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
    [Route("v1.0/pgiaodich")]
    [ApiController]
    public class PGiaoDichController : BaseController
    {
        private readonly IPGiaoDichService _pGiaoDichService;
        public PGiaoDichController(ILogger<PGiaoDichController> logger, IMemoryCache memoryCache, IPGiaoDichService pGiaoDichService) : base(logger, memoryCache)
        {
            _pGiaoDichService = pGiaoDichService;
        }

        [HttpPost("list-used")]
        public async Task<IActionResult> ListUsed(TRequest<PaginationRequest> request)
        {
            var response = new Response<object>();
            try
            {
                var listData = await _pGiaoDichService.listUsedGD(request.value.pageIndex, request.value.pageSize);
                return Ok(new
                {
                    success = true,
                    message = "",
                    listdata = listData
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("list-success")]
        public async Task<IActionResult> ListSuccess(TRequest<PaginationRequest> request)
        {
            var response = new Response<object>();
            try
            {
                var listData = await _pGiaoDichService.listSuccessGD(request.value.pageIndex, request.value.pageSize);
                return Ok(new
                {
                    success = true,
                    message = "",
                    listdata = listData
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
                var pGD = await _pGiaoDichService.GetById(request.value);
                var listGD = await _pGiaoDichService.GetByPGDID(request.value); 
                return Ok(new
                {
                    success = true,
                    message = "",
                    data = pGD,
                    list = listGD
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("paid")]
        public async Task<IActionResult> Paid(TRequest<int> request)
        {
            var response = new Response<object>();
            try
            {
                var check = await _pGiaoDichService.Paid(request.value);
                return Ok(new
                {
                    success = check >= 0,
                    message = ""
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
