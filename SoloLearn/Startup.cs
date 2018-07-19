using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using React.AspNet;

using Microsoft.Extensions.Options;

namespace SoloLearn
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddReact();
	  services.AddCors();

			services.AddDataProtection()
								.PersistKeysToFileSystem(new DirectoryInfo(@"C:\DataProtection"))
								.SetDefaultKeyLifetime(TimeSpan.FromDays(365 * 10))
								.UseCryptographicAlgorithms(new AuthenticatedEncryptionSettings
								{
														
										EncryptionAlgorithm = EncryptionAlgorithm.AES_256_GCM,
										ValidationAlgorithm = ValidationAlgorithm.HMACSHA512
								});
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
	  app.UseCors(builder =>
builder.WithOrigins("http://localhost:3000")
.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials().SetPreflightMaxAge(TimeSpan.FromDays(356))
);
	  app.UseMiddleware<ServiceProxyMiddleware>(Options.Create(new ProxyOptions
			{
				Scheme = "http",
				Host = "localhost"
			}));

            // Initialise ReactJS.NET. Must be before static files.
            app.UseReact(config =>
            {
                // If you want to use server-side rendering of React components,
                // add all the necessary JavaScript files here. This includes
                // your components as well as all of their dependencies.
                // See http://reactjs.net/ for more information. Example:
                //config
                //  .AddScript("~/Scripts/First.jsx")
                //  .AddScript("~/Scripts/Second.jsx");

                // If you use an external build too (for example, Babel, Webpack,
                // Browserify or Gulp), you can improve performance by disabling
                // ReactJS.NET's version of Babel and loading the pre-transpiled
                // scripts. Example:
                //config
                //  .SetLoadBabel(false)
                //  .AddScriptWithoutTransform("~/Scripts/bundle.server.js");
            });

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "GetSession",
                    template: "{controller=Ajax}/{action=GetSession}");

                routes.MapRoute("default", "{*url}", new { controller = "Home", action = "Index" });
            });
        }
    }
}
