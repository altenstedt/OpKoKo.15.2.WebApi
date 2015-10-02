using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using ResourceServer.DataContracts;
using ResourceServer.DAL;

namespace ResourceServer.Controllers
{
    [Authorize]
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/async/values")]
    public class ValuesAsyncController : ApiController
    {
        [HttpGet]
        [Route("")]
        public async Task<ValueDataContract> Read(int id)
        {
            using (var context = new Context())
            {
                var valuesRepo = new ValueRepository(context);
                var result = await valuesRepo.GetValueAsync(id);

                return result;
            }
        }

        [HttpPost]
        [Route("")]
        public async Task<ValueDataContract> Update([FromBody] ValueDataContract value)
        {
            using (var context = new Context())
            {
                var valuesRepo = new ValueRepository(context);
                var result = await valuesRepo.AddOrUpdateValueAsync(value);

                return result;
            }
        }
    }
}