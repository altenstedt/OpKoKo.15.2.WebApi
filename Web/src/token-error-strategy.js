import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import * as LogManager from 'aurelia-logging';
import {Redirect} from 'aurelia-router';

var logger = LogManager.getLogger('opkoko');

@inject(Router)
export class TokenErrorStrategy {

  constructor(router) {
    this.router = router;
  }

  error(tokenService, response) {
    logger.debug("Error strategy will log off and route to login");

    tokenService.logOff();

    return new Redirect('login').navigate(this.router);
  }
}
