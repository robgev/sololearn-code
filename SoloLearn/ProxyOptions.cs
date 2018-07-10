using System.Net.Http;

namespace SoloLearn
{
    public class ProxyOptions
    {
        public string Scheme { get; set; }
        public string Host { get; set; }
        public string Port { get; internal set; }
        public HttpClientHandler BackChannelMessageHandler { get; internal set; }
    }
}