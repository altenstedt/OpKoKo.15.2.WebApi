using System.Web.Http;
using Owin;

namespace ResourceServer
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute("Api", "{Controller}");
            config.EnableCors();
            app.UseWebApi(config);
        }
    }
}