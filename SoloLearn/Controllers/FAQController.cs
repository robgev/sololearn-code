using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SoloLearn.Extensions;

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
			var values = new Dictionary<string, string>
			{
					{ "alias", "FAQ" }
			};
			var content = new FormUrlEncodedContent(values);

			ProxyOptions proxyOptions = new ProxyOptions
			{
				Scheme = _configuration["Api1:Scheme"],
				Host = _configuration["Api1:Host"],
				Url = _configuration["Api1:Url"]
			};

			string url = $"{proxyOptions.Scheme}://{proxyOptions.Host}:{proxyOptions.Port}/GetStaticPage";
			var response = await Client.PostAsync(url, content);

			var responseString = await response.Content.ReadAsStringAsync();
			dynamic responseObj = JsonConvert.DeserializeObject(responseString);
			ViewData["message"] = responseObj.Page.PageContent;
			return View();
		}
  }
}
