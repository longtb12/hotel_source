using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ApiService.Dependency;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft;
namespace ApiService
{
    public class Startup
    {
        public Startup(IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(env.ContentRootPath)
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();                 
            services.AddMemoryCache();
            services.AddCors(o =>
            {
                o.AddPolicy("_myAllowSpecificOrigins", builder =>
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            DependencyService.AddDependency(services, Configuration);
            services.AddControllers().AddNewtonsoftJson(opt => {
                opt.UseMemberCasing();
            });
            services.AddSession();
            //services.AddMvc()
                       // .AddSessionStateTempDataProvider();
            services.AddMvc();
            services.AddHttpContextAccessor();
            //services.AddMemoryCache();
            services.AddDistributedMemoryCache();
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            //app.UseMvc();
            //app.UseRouting();
            app.UseAuthentication();
            app.UseRouting();
            app.UseCors("_myAllowSpecificOrigins");
            app.UseAuthorization();
            app.UseSession();
            //app.UseMvcWithDefaultRoute();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}"
                );
            });

        }
    }
}
