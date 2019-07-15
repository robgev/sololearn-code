using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SoloLearn.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SoloLearn.Controllers
{
  public class PrivacyController: Controller
  {
		private readonly IConfiguration _configuration;
		private static readonly HttpClient Client = new HttpClient();
		public PrivacyController(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		public async Task<IActionResult> Index()
		{
			StaticPagesService pagesService = new StaticPagesService(_configuration);
			dynamic page = await pagesService.GetPage("Privacy-Policy");
			ViewData["message"] = page.PageContent;
			return View();
		}
  }
}
