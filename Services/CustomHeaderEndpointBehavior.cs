using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;
using System.Text;

namespace Services.WebService
{
    class CustomHeaderEndpointBehavior : IEndpointBehavior, IClientMessageInspector
    {
        public static readonly string Namespace = "http://ns.sololearn.com/websiteservice/";

        private Dictionary<string, string> CustomHeaders { get; set; }

        public void AddBindingParameters(ServiceEndpoint endpoint, System.ServiceModel.Channels.BindingParameterCollection bindingParameters)
        {
        }

        public void ApplyClientBehavior(ServiceEndpoint endpoint, System.ServiceModel.Dispatcher.ClientRuntime clientRuntime)
        {
            clientRuntime.MessageInspectors.Add(this);
        }

        public void ApplyDispatchBehavior(ServiceEndpoint endpoint, System.ServiceModel.Dispatcher.EndpointDispatcher endpointDispatcher)
        {
        }

        public void Validate(ServiceEndpoint endpoint)
        {
        }

        public CustomHeaderEndpointBehavior(Dictionary<string, string> customHeaders)
        {
            CustomHeaders = customHeaders;
        }

        public void AfterReceiveReply(ref System.ServiceModel.Channels.Message reply, object correlationState)
        {
        }

        public object BeforeSendRequest(ref System.ServiceModel.Channels.Message request, System.ServiceModel.IClientChannel channel)
        {
            foreach (var item in CustomHeaders)
            {
                request.Headers.Add(new MessageHeader<string>(item.Value).GetUntypedHeader(item.Key, Namespace));
            }
            return null;
        }
    }
}
