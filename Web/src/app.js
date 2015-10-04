import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {TokenService} from './token-service';

export class App {
  configureRouter(config, router){
    config.title = 'OpKoKo 15.2';
    config.addPipelineStep('authorize', AuthorizeStep); // Add a route filter to the authorize extensibility point.
    config.map([
      { route: ['','values'],  name: 'values', moduleId: 'values', nav: true, title:'Values', auth: true },
      { route: 'login', moduleId: 'login', nav: false, title:'Log On' }
    ]);

    this.router = router;
  }
}

@inject(TokenService)
class AuthorizeStep {
  constructor(tokenService) {
    this.tokenService = tokenService;

  }
  run(routingContext, next) {
    // Check if the route has an "auth" key
    // The reason for using `nextInstructions` is because
    // this includes child routes.
    if (routingContext.nextInstructions.some(i => i.config.auth)) {
      var isLoggedOn = this.tokenService.isLoggedOn();
      if (!isLoggedOn) {
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }
}
