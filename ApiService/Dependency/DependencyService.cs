using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccess.Repositories.Implementations;
using DataAccess.Repositories.Interfaces;
using DataServices.Interfaces;
using DataService.Data.Interfaces;
using DataService.Data.Implementations;
using DataServices.Implementations;
namespace ApiService.Dependency
{
    public static class DependencyService
    {
        public static void AddDependency(this IServiceCollection services, IConfiguration configuration)
        {
            //Add repository
            services.AddTransient<IRepository, Repository>();
            //Add service
            services.AddTransient<IUserServicecs, UserService>();
            services.AddTransient<IDepartmentService, DepartmentService>();
            services.AddTransient<IFunctionService, FunctionService>();
            services.AddTransient<IPositionService, PositionService>();
            services.AddTransient<IRoomTypeService, RoomTypeService>();
            services.AddTransient<IRoomService, RoomService>();
            services.AddTransient<ICustomerService, CustomerService>();
            services.AddTransient<IGiaoDichService, GiaoDichService>();
            services.AddTransient<IPGiaoDichService, PGiaoDichService>();
        }
    }
}
