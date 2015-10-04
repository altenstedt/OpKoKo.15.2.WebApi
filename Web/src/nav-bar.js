import {Router} from 'aurelia-router';
import {TokenService} from './token-service';
import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';

@inject(TokenService)
export class NavBar {
  @bindable router = null;

  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  created(view) {
    return this.tokenService.initialize();
  }

  get fullName() {
      return this.tokenService.claims.unique_name;
  }

  get isLoggedOn() {
    return this.tokenService.isLoggedOn();
  }

  get claims() {
    return this.tokenService.claims;
  }
}

export class ClaimsFilterValueConverter {
  toView(routes, claims) {
    return routes.filter(i => claims[i.config.settings.claim]);
  }
}
