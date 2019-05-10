using Newtonsoft.Json;
using SoloLearn.Service.Browser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SoloLearn.Service
{
  public class ServiceWrapper
  {

	public async Task<TokenAuthenticationResult> Authenticate(string refreshToken, string appVersion, string userAgent, string ipAddress, string locale,string url)
	{
	  UserAgent ua = new UserAgent(userAgent);

	  var browser = ua.Browser.Name;
	  var browserVersion = ua.Browser.Version;
	  var os = ua.OS.Name + " " + ua.OS.Version;


	  using (var client = new HttpClient())
	  using (HttpContent content = new FormUrlEncodedContent(new Dictionary<string, string>
						{
							{ "at", GenerateTimedSignature("+H3h3yN32U53cR3T!$!@#$%-^21456f---5fdsgdf&*(", DateTime.UtcNow) },
							{ "refreshToken", refreshToken },
							{ "appVersion", appVersion },
							{ "ipAddress", ipAddress },
							{ "browser", browser },
							{ "browserVersion", browserVersion },
							{ "os", os },
						}.Where(f => f.Value != null).ToDictionary(x => x.Key, x => x.Value)))
	  {
		using (var response = await client.PostAsync(url, content))
		{
		  return JsonConvert.DeserializeObject<TokenAuthenticationResult>(await response.Content.ReadAsStringAsync());
		}
	  }
	}



	private string GenerateTimedSignature(string secret, DateTime dateTiem)
	{
	  string key = dateTiem.ToString("yyyyMMddHHmm");

	  using (var sha = new HMACSHA1(Encoding.ASCII.GetBytes("YWJib2N4ZGtlc2ZDZ2hoaWlBamNraGx1bW1u")))
	  {
		var hash = sha.ComputeHash(Encoding.ASCII.GetBytes(key + secret));
		return String.Format("{0:00}{1}", DateTime.UtcNow.Minute, Convert.ToBase64String(hash));
	  }
	}
  }
}
