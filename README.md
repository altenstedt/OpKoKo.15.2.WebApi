# Creating

The overall approach for creating the Web API projects with an
*abolute minimal* footpring is to start with an Empty project type in
Visual Studio and then add the NuGet packages by hand:

  1. Empty web project
  2. Install-Package Microsoft.Owin.Host.SystemWeb
  3. Install-Package Microsoft.AspNet.WebApi.Owin
  4. Install-Package Microsoft.AspNet.WebApi.Cors
  5. Class Startup
  6. Folder Controllers
  7. Add new controller

