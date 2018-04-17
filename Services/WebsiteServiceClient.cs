using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text.RegularExpressions;
using System.Web;

namespace Services.WebService
{
    public partial class WebsiteServiceClient
    {
        private Dictionary<string, string> CustomHeaders { get; set; }

        public string ClientID { get { return CustomHeaders["ClientID"]; } set { CustomHeaders["ClientID"] = value; } }
        public string SessionID { get { return CustomHeaders["SessionID"]; } set { CustomHeaders["SessionID"] = value; } }

        public static WebsiteServiceClient ForClient(string clientID)
        {
            NetNamedPipeBinding binding = new NetNamedPipeBinding();
            EndpointAddress endpoint = new EndpointAddress("net.pipe://localhost/services/WebsiteService.svc");
            var serviceClient = new WebsiteServiceClient(binding, endpoint);
            serviceClient.CustomHeaders = new Dictionary<string, string>();
            serviceClient.CustomHeaders["ClientID"] = clientID;
            serviceClient.CustomHeaders["SessionID"] = Guid.Empty.ToString();
            serviceClient.Endpoint.EndpointBehaviors.Add(new CustomHeaderEndpointBehavior(serviceClient.CustomHeaders));
            //var scope = new OperationContextScope(serviceClient.InnerChannel);
            //{

            //    var clientIDHeader = new MessageHeader<string>(clientID).GetUntypedHeader("ClientID", Namespace);
            //    var sessionIDHeader = new MessageHeader<string>(Guid.Empty.ToString()).GetUntypedHeader("SessionID", Namespace);
            //    OperationContext.Current.OutgoingMessageHeaders.Add(clientIDHeader);
            //    OperationContext.Current.OutgoingMessageHeaders.Add(sessionIDHeader);
            //}
            return serviceClient;
        }

        public WebAuthenticationResult Authenticate(string appVersion = "0.0.0.0") //Controller controller,
        {
            int userID = 8800161;// 2259519; //1042 //24379
            //if (controller.User != null) userID = controller.User.Id;
            var browser = "Chrome";//controller.Request.Browser;
            var os = "Windows NT 6.3; WOW64";//Regex.Match(controller.Request.UserAgent, @"(?<=\().*?(?=\))").Value;
            var browserVersion = "54";

            //var result = Authenticate(userID, os, browser.Browser, browser.Version, appVersion);
            var result = Authenticate(userID, os, browser, browserVersion, appVersion);
            SessionID = result.SessionId.ToString();
            return result;
        }

        public static WebsiteServiceClient ForWeb()
        {
            return ForClient("Web.SoloLearn.Html");
        }
    }
}
