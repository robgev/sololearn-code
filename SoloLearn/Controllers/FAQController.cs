using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SoloLearn.Extensions;
using SoloLearn.Service;

namespace SoloLearn.Controllers
{
  public class FAQController : Controller
  {
		private readonly IConfiguration _configuration;
		private static readonly HttpClient Client = new HttpClient();
		public FAQController(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		public async Task<IActionResult> Index()
		{
	  StaticPagesService pagesService = new StaticPagesService(_configuration);
	  dynamic page = await pagesService.GetPage("FAQ");
			ViewData["message"] = page.PageContent;
			return View();
		}
  }
}
