using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SoloLearn.Service
{
  public class StaticPagesService
  {
		private readonly IConfiguration _configuration;
		private static readonly HttpClient Client = new HttpClient();
		public StaticPagesService(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public async Task<object> GetPage(string alias)
	{
	  var values = new Dictionary<string, string>
			{
					{ "alias", alias }
			};
	  var content = new FormUrlEncodedContent(values);

	  ProxyOptions proxyOptions = new ProxyOptions
	  {
		Scheme = _configuration["Api1:Scheme"],
		Host = _configuration["Api1:Host"],
		Url = _configuration["Api1:Url"]
	  };

	  string url = $"{proxyOptions.Scheme}://{proxyOptions.Host}:{proxyOptions.Port}{_configuration["StaticPagesUrl"]}";
	  var response = await Client.PostAsync(url, content);

		 var responseString = await response.Content.ReadAsStringAsync();
		 dynamic responseObj = JsonConvert.DeserializeObject(responseString);
		 return responseObj.Page;
	}

  }
}
