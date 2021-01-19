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
    [Route("v1.0/customer")]
    [ApiController]
    public class CustomerController : BaseController
    {
        private readonly ICustomerService _customerService;
        public CustomerController(ILogger<CustomerController> logger, IMemoryCache memoryCache, ICustomerService customerService) : base(logger, memoryCache)
        {
            _customerService = customerService;
        }

        [HttpPost("get-pading")]
        public async Task<IActionResult> GetPading(TRequest<PaginationRequest> request)
        {
            var response = new Response<object>();
            try
            {
                var customers = await _customerService.ListData(request.value.pageIndex, request.value.pageSize, request.value.textSearch);
                var paging = Convert.ToDouble(customers.Total / request.value.pageSize);
                paging = (customers.Total % request.value.pageSize == 0 ? paging : paging + 1);
                var total_page = Math.Round(paging, MidpointRounding.AwayFromZero);
                return Ok(new
                {
                    success = true,
                    message = "",
                    listdata = customers,
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
                response.Data = await _customerService.GetById(request.value);
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
        public async Task<IActionResult> Save(TRequest<CustomerRequest> request)
        {
            if (request == null)
                return NotFound();
            var response = new Response<int>();
            try
            {
                if (request.value.Id == 0)
                {
                    response.Data = await _customerService.Add(request.value);
                    response.Message = "Thêm thành công";
                    response.Success = true;
                }
                else
                {
                    response.Data = await _customerService.Update(request.value);
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
                response.Data = await _customerService.Delete(request.value);
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
