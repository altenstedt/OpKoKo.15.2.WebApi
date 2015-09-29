import {Router} from 'aurelia-router';
import {TokenService} from './token-service';
import {inject} from 'aurelia-framework';

@inject(TokenService, Router)
export class Login {
    constructor(service, router) {
        this.heading = 'Log On';
        this.email = '';
        this.password = '';
        this.response = "";
        this.disabled = false;
        this.service = service;
        this.aRouter = router;
    }

    activate() {
        this.service.logOff();
        this.aRouter.navigate("#/login");
    }

    handleErrorResponse(message) {
      this.disabled = false;
      if (message && (message.status === 400 || message.status === 401)) {
        this.response = "Invalid email or password."
      } else {
        this.response = "Log in failed."
      }
    }

    logOn() {
        this.response = "";
        this.disabled = true;
        this.service.logOn(this.email, this.password)
            .then(response => {
              if (response && response.status >= 200 && response.status < 300) {
                this.aRouter.navigate("");
                this.disabled = false;
              } else {
                this.handleErrorResponse(response);
              }
            })
            .catch((message) => {
              this.handleErrorResponse(message);
            });
    }
}
