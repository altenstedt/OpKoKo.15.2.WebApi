using System.Web.Http;
using System.Web.Http.Cors;
using ResourceServer.DataContracts;
using ResourceServer.DAL;

namespace ResourceServer.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/sync/values")]
    public class ValuesSyncController:ApiController
    {
        [HttpGet]
        [Route("")]
        public ValueDataContract Read(int id)
        {
            //TODO: Why are EF references needed in web host?
            using (var context = new Context())
            {
                var valuesRepo = new ValueRepository(context);
                var result = valuesRepo.GetValue(id);

                return result;
            }
        }

        [HttpPost]
        [Route("")]
        public ValueDataContract Update([FromBody] ValueDataContract value)
        {
            using (var context = new Context())
            {
                var valuesRepo = new ValueRepository(context);
                var result = valuesRepo.AddOrUpdateValue(value);

                return result;
            }
        }
    }
}