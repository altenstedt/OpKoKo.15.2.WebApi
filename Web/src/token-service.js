import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import * as LogManager from 'aurelia-logging';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TokenErrorStrategy} from './token-error-strategy';

var logger = LogManager.getLogger('opkoko');

@inject(HttpClient, EventAggregator, TokenErrorStrategy)
export class TokenService {
  accessToken = null;
  accessTokenExpires = null;
  refreshToken = null;
  claims = {};

  constructor(http, eventAggregator, tokenErrorStrategy) {
    this.http = http;
    this.eventAggregator = eventAggregator;
    this.tokenErrorStrategy = tokenErrorStrategy;

    this.tokenUrl = "https://your.api/token";

    this.http.configure(config => {
        config
            .useStandardConfiguration();
        });

    this.refreshToken = this.retrieveRefreshToken();
  }

  initialize() {
    if (this.refreshToken && !this.accessToken) {
      return this.logOnWithRefreshToken();
    } else {
      return Promise.resolve();
    }
  }

  logOn(username, password) {
    var pass = encodeURIComponent(password);
    var pass2 = pass.replace(/%20/g, '+');
    var content = `grant_type=password&username=${username}&password=${pass2}`;

    return this.http.fetch(this.tokenUrl, {
      mode: "cors",
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: content
    })
    .then(response => {
      if (response && response.status >= 200 && response.status < 300) {
          return response.json()
            .then(jwt => {
              this.handleTokenResponse(jwt);
              return Promise.resolve(response);
            });
      } else{
        return Promise.resolve(response);
      }
    });
  }

  isLoggedOn() {
    return this.refreshToken;
  }

  logOff() {
    localStorage.removeItem("refreshToken");

    this.refreshToken = null;
    this.accessToken = null;
    this.accessTokenExpires = null;

    this.claims = {};
    this.eventAggregator.publish("user", null);

    logger.debug("Logged off");
  }

  logOnWithRefreshToken() {
    var encoded = encodeURIComponent(this.refreshToken).replace(/%20/g, '+');
    var content = `grant_type=refresh_token&refresh_token=${encoded}`;
    var timeId = `POST ${this.tokenUrl} HTTP/1.1`;

    console.time(timeId);

    return this.http.fetch(this.tokenUrl, {
          mode: "cors",
          method: "post",
          headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
          body: content
        })
      .then(response => {
          if (response.status >= 200 && response.status < 300) {
              return response;
          } else {
            logger.debug(`Non success status code ${response.status} returned`);
            return this.tokenErrorStrategy.error(this, response);
          }})
      .then(response => response.json())
      .then(jwt => {
          this.handleTokenResponse(jwt);

          console.timeEnd(timeId);
      })
      .catch(error => {
        logger.debug(`Error caught ${error}`);
        return this.tokenErrorStrategy.error(this, error);
      });
  }

  invoke(action, http) {
    if (this.isTokenValid()) {
      console.time(http);
      return action(this.accessToken).then((message) => {
          console.timeEnd(http);
          return message;
        });
      } else {
        return this.logOnWithRefreshToken()
          .then(() => action(this.accessToken));
      }
  }

  handleTokenResponse(jwt) {
    this.refreshToken = jwt.refresh_token;
    this.accessToken = jwt.access_token;
    this.accessTokenExpires = new Date(new Date().getTime() + jwt.expires_in * 1000);

    this.claims = this.getClaims(jwt.access_token);
    this.eventAggregator.publish("user", this.claims.unique_name);

    this.storeRefreshToken(this.refreshToken);
  }

  isTokenValid() {
    var date = new Date(new Date().getTime() + 60 * 1000);  // One minute safe guard

    if (this.accessToken) {
      if (date > new Date(this.accessTokenExpires)) {
        logger.debug(`Token with expiration ${new Date(this.accessTokenExpires)} is considered expired at ${new Date()}`);

        return false;
      } else {
        return true;
      }
    }

    return false;
  }

  getClaims(accessToken) {
    if (accessToken) {
      let segments = accessToken.split(".");
      if (segments.length !== 3) {
        throw new Error("Invalid JWT");
      }

      return JSON.parse(window.atob(segments[1]));
    } else {
      return null;
    }
  }

  storeRefreshToken(refreshToken) {
    localStorage.refreshToken = refreshToken;
  }

  retrieveRefreshToken() {
    return localStorage.refreshToken;
  }
}
