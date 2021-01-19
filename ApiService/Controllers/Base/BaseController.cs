using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Sercurities.Extensions;
namespace ApiService.Controllers
{
    //[Produces("application/json")]
    [Route("v1.0/[controller]")]
    [ApiController]
    [RequiredAuthorize]
    public class BaseController : ControllerBase
    {
        private readonly IMemoryCache _memoryCache;
        public readonly ILogger _logger;
        public BaseController(ILogger logger, IMemoryCache memoryCache)
        {
            _logger = logger;
            _memoryCache = memoryCache;
        }
    }
}
