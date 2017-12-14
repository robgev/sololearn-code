using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.WebService;

namespace SoloLearn.Controllers
{
    public class AjaxController : Controller
    {
        [HttpPost]
        public JsonResult GetSession(string clientID, string deviceID, Guid? sessionID, string appVersion)
        {
            using (var service = WebsiteServiceClient.ForClient(clientID))
            {
                if (sessionID != null)
                {
                    service.SessionID = sessionID.Value.ToString();
                }

                try
                {
		  //var auth = service.Authenticate(this, appVersion);
		  var auth = service.Authenticate("beta");// appVersion);
                    return Json(auth);
                }
                catch (Exception e)
                {
                    Response.StatusCode = (int)System.Net.HttpStatusCode.Forbidden;
                    return Json(new { Error = 403, Message = e.Message, ST = e.StackTrace });
                }
            }
        }
    }
}
