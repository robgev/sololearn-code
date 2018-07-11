using SoloLearn.Utils.Browser;
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
        //public string SessionID { get { return CustomHeaders["SessionID"]; } set { CustomHeaders["SessionID"] = value; } }

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

        public TokenAuthenticationResult Authenticate(string refreshToken, string appVersion, string userAgent, string ipAddress, string locale) //Controller controller,
        {
            UserAgent ua = new UserAgent(userAgent);

            var browser = ua.Browser.Name;
            var browserVersion = ua.Browser.Version;
            var os = ua.OS.Name + " " + ua.OS.Version;

            //var result = Authenticate(userID, os, browser.Browser, browser.Version, appVersion);
            var result = AuthenticateBearer(refreshToken, os, browser, browserVersion, appVersion, ipAddress, locale);
            //SessionID = result.SessionId.ToString();
            return result;
        }

        public static WebsiteServiceClient ForWeb()
        {
            return ForClient("Web.SoloLearn");
        }
    }
}
