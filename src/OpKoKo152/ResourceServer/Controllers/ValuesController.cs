using System.Web.Http;
using System.Web.Http.Cors;

namespace ResourceServer.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/values")]
    public class ValuesController:ApiController
    {
        [HttpGet]
        [Route("")]
        public string Read()
        {
            return "Hello";
        }

        [HttpPost]
        [Route("")]
        public string Update([FromBody] string value)
        {
            //TODO: Update value
            return value;
        }
    }
}