using System.Configuration;
using System.Linq;
using System.Net.Http.Formatting;
using System.Security.Cryptography.X509Certificates;
using System.Web.Http;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
using Newtonsoft.Json.Serialization;
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

            var issuer = ConfigurationManager.AppSettings["Issuer"];
            var audience = ConfigurationManager.AppSettings["Audience"];
            var signingCertificateSubjectDistinguishedName = ConfigurationManager.AppSettings["SigningCertificateSubjectDistinguishedName"];

            var store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
            store.Open(OpenFlags.ReadOnly);
            var certificate = store.Certificates.Find(X509FindType.FindBySubjectDistinguishedName, signingCertificateSubjectDistinguishedName, true)[0];

            // JSON should serialize to camelCase, not PascalCase (the default)
            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Api controllers with an [Authorize] attribute will be validated with JWT
            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = AuthenticationMode.Active,
                    AllowedAudiences = new[] {audience},
                    IssuerSecurityTokenProviders = new IIssuerSecurityTokenProvider[]
                    {
                        new X509CertificateSecurityTokenProvider(issuer, certificate),
                        //new X509CertificateSecurityTokenProvider(issuer, new X509Certificate2("PATH_TO_YOUR_PUBLIC_CERTIFICATE.cer")),
                    },
                });

            app.UseWebApi(config);
        }
    }
}