using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SoloLearn.Service;

namespace SoloLearn.Controllers
{
		public class AjaxController : Controller
		{
			private static readonly string CookieKey = "M31542";
			private readonly IDataProtector _protector;
			private readonly IConfiguration _configuration;

	public AjaxController(IDataProtectionProvider provider, IConfiguration configuration)
			{
				_protector = provider.CreateProtector(GetType().FullName);
				_configuration = configuration;
			}

			[HttpPost]
			public async Task<JsonResult> GetSession(string locale)
			{

				try
				{
				string refreshToken = null;

				var token = Request.Cookies[CookieKey];

				if (token != null)
				{
					try
					{
					refreshToken = _protector.Unprotect(token);
					}
					catch { }
				}

				//var auth = service.Authenticate(this, appVersion);
				var auth = await new ServiceWrapper().Authenticate(refreshToken, "beta", this.Request.Headers["User-Agent"], this.HttpContext.Connection.RemoteIpAddress.ToString(), locale, _configuration["AuthenticationUrl"]);// appVersion);


				Response.Cookies.Append(CookieKey, _protector.Protect(auth.RefreshToken), new Microsoft.AspNetCore.Http.CookieOptions() { HttpOnly = true, Expires = DateTimeOffset.UtcNow.AddMonths(9) });
				return Json(new
				{
					auth.AccessToken,
					auth.ExpiresIn,
					auth.User
				});
				}
				catch (Exception e)
				{
				Response.StatusCode = (int)System.Net.HttpStatusCode.Forbidden;
				return Json(new { Error = 403, Message = e.Message, ST = e.StackTrace });
				}
			}
		}
}
