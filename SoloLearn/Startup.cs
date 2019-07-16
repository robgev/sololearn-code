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
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Newtonsoft.Json;

namespace SoloLearn
{
  public class Startup
  {

	public Startup(IConfiguration configuration)
	{
	  Configuration = configuration;
	}

	public IConfiguration Configuration { get; }
	// This method gets called by the runtime. Use this method to add services to the container.
	// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
	public void ConfigureServices(IServiceCollection services)
	{
	  services.AddMvc();
	  services.AddCors();

	  services.AddDataProtection()
				.PersistKeysToFileSystem(new DirectoryInfo(Configuration["DataProtectionStore"]))
				.SetDefaultKeyLifetime(TimeSpan.FromDays(365 * 10))
				.UseCryptographicAlgorithms(new AuthenticatedEncryptorConfiguration()
				{
				  EncryptionAlgorithm = EncryptionAlgorithm.AES_256_CBC,
				  ValidationAlgorithm = ValidationAlgorithm.HMACSHA512
				});

	  services.AddRendertron(options =>
	  {
			options.RendertronUrl = Configuration["RendertronUrl"];

			String filePath = Configuration["CrawlerAgentsFilePath"];
			using (StreamReader r = new StreamReader(filePath))
			{
				string json = r.ReadToEnd();
				dynamic array = JsonConvert.DeserializeObject(json);
				foreach (var item in array)
				{
					options.UserAgents.Add((String)item.pattern);
				}
			}
			// use http compression
			options.AcceptCompression = true;
			options.Timeout = TimeSpan.FromSeconds(60);
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
			  builder.WithOrigins(Configuration["ClientUrl"])
			  .AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials().SetPreflightMaxAge(TimeSpan.FromDays(356))
			  );

	  app.UseMiddleware<ServiceProxyMiddleware>(Options.Create(new ProxyOptions
	  {
		Scheme = Configuration["Api1:Scheme"],
		Host = Configuration["Api1:Host"],
		Path = Configuration["Api1:Path"],
		Url = Configuration["Api1:Url"],
		Port=Configuration["Api1:Port"]
	  }));

	  app.UseMiddleware<ServiceProxyMiddleware>(Options.Create(new ProxyOptions
	  {
		Scheme = Configuration["Api2:Scheme"],
		Host = Configuration["Api2:Host"],
		Path = Configuration["Api2:Path"],
		Url = Configuration["Api2:Url"]
	  }));

	  // Initialise ReactJS.NET. Must be before static files.


	  var cachePeriod = env.IsDevelopment() ? "600" : "604800";
	  app.UseStaticFiles(new StaticFileOptions
	  {
		OnPrepareResponse = ctx =>
		{
		  // Requires the following import:
		  // using Microsoft.AspNetCore.Http;
		  ctx.Context.Response.Headers.Append("Cache-Control", $"public, max-age={cachePeriod}");
		}
	  });
	  app.UseRendertron();
	  app.UseMvc(routes =>
	  {
		routes.MapRoute(
			name: "GetSession",
			template: "{controller=Ajax}/{action=GetSession}");

		routes.MapRoute(
					name: "default",
					template: "{controller}/{action=Index}/{id?}");
	  });

	  app.UseSpa(spa =>
	  {
		spa.Options.SourcePath = "src";

		if (env.IsDevelopment())
		{
		  spa.UseReactDevelopmentServer(npmScript: "start");

		}
	  });
	}
  }
}
