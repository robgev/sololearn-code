using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace SoloLearn
{
  public class Program
  {
	public static void Main(string[] args)
	{
	  var config = new ConfigurationBuilder()
		  .SetBasePath(Directory.GetCurrentDirectory())
		  .AddJsonFile("appsettings.json", optional: false)
		  .Build();

	  CreateWebHostBuilder(args).UseUrls(config.GetSection("ApplicationUrl").Value).Build().Run();
	}

	public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
		WebHost.CreateDefaultBuilder(args)
			.UseStartup<Startup>();
  }
}
