import {TokenService} from '../../src/token-service';

class HttpStub {
  status = 200;
  urls = [];

  fetch(url) {
    var response = {
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IldrTE43NXozRkpMYTZWLWJ5TWxGWi05bFFmdyJ9.eyJ1cm46cmVub3ZhOnVzZXJzIjoiNyIsInVybjpyZW5vdmE6b3JkZXJzIjoiNyIsInVybjpyZW5vdmE6c3RhdGlzdGljcyI6IjciLCJ1cm46cmVub3ZhOmJpbGxpbmciOiI3IiwidXJuOnJlbm92YTpmb3JtcyI6IjciLCJ1cm46cmVub3ZhOmRldmlhdGlvbnMiOiI3IiwidXJuOnJlbm92YTpoZWxwIjoiNyIsImVtYWlsIjoibWFydGluLmFsdGVuc3RlZHRAZ21haWwuY29tIiwidW5pcXVlX25hbWUiOiJNYXJ0aW4gQWx0ZW5zdGVkdCIsImlzcyI6InVybjpyZW5vdmE6c3RzIiwiYXVkIjoidXJuOnJlbm92YTpnZW5lcmljIiwiZXhwIjoxNDQzMDExNTk5LCJuYmYiOjE0NDMwMTA5OTl9.I6B7UQzg4ok3W6Usa5U7wIGgVyADWyjDszNqBttYqRsykUC0V6gSsyPtp_9HKUUaQ2IEwZwq0Tg-0x7CMbThcPj_QDxHZXWWQ3718AcoVmNnAwP-erAb9RzuFX3BTmxKgnQ4ZItcfbrN4vHvf1zoPkG62jzFKuW0b_pFLi6Bj-uCtyKAmYg-snZ3IIYYCgXQiRY3kjaQJqbAVE82O-KwlWf9Cd0NwbXhWFg9cnnzKrYfLcWTopKwMYfKMUIJ6Tkx70B-lRZVEoH7NhtzgAT0uzYhouJAuDdIEmN9ysnTtgvgOFKW-XyvggKs4PVzIgNBOlOE-IabNTnB4A86PTUc8g",
      "token_type": "Bearer",
      "expires_in": 600,
      "refresh_token": "6e258ae0d7c60d0613ed0ccab5752c83a8c1460f1eb6f4d81743863f8476c376bc0782ccd1c3ec39b2a409"
    };

    this.url = url;
    this.urls.push(url);

    var tmp = new Promise((resolve) => { resolve(response); });
    return new Promise((resolve) => { resolve({ json: () => tmp, status: this.status }); });
  }
  configure(func){
  }
}

class EventAggregatorStub {
  publish() {
  }
}

class ThrowErrorStrategy {
  error(tokenService, response) {
    throw new Error(response);
  }
}

describe('the token service module', () => {
  let http = new HttpStub(),
      eventAggregator = new EventAggregatorStub(),
      errorStrategy = new ThrowErrorStrategy(),
      sut;

  beforeEach(() => {
    sut = new TokenService(http, eventAggregator, errorStrategy);
  });

  it('should to start', () => {
    expect(sut).toBeDefined();
  });

  it('should log on', done => {
    sut.logOn("email", "password")
      .then(response => {
        expect(sut.isLoggedOn()).toBeTruthy();
        expect(sut.claims.unique_name).toBe("Martin Altenstedt");
        expect(sut.claims.email).toBe("martin.altenstedt@gmail.com");
        done();
      })
      .catch(error => {
        fail(`logOn threw an error ${error.message}`);
        done();
      });
  });

  it('should log off', done => {
    sut.logOn("email", "password")
      .then(response => {
        expect(sut.isLoggedOn()).toBeTruthy();
        done();
      })
      .catch(error => {
        fail(`logOn threw an error ${error.message}`);
        done();
      });

    sut.logOff("email", "password");

    expect(sut.isLoggedOn()).not.toBeTruthy();
    expect(sut.claims.unique_name).not.toBeDefined();
    expect(sut.claims.email).not.toBeDefined();
  });

  it('should not throw on wrong credentials', done => {
    http.status = 400;
    sut.logOn("email", "password")
      .then(response => {
        expect(response.status).toBe(400);
        done();
      })
      .catch(error => {
        fail(`logOn should not throw when a non 200 status code is returned`);
        done();
      });
  });

  it ('should invoke on valid access token', done => {
    http.status = 200;
    sut.logOnWithRefreshToken = () => { throw "Should not execute" };
    sut.logOn("email", "password")
      .then(response => {
        sut.invoke(() => Promise.resolve(), "http")
          .then(response => {
            done();
          });
      });
  });

  it ('should refresh before invoke on expired access token', done => {
    http.status = 200;
    http.urls = [];
    sut.logOn("email", "password")
      .then(response => {
        sut.accessTokenExpires = new Date();
        sut.invoke(() => Promise.resolve(), "http")
          .then(response => {

            // One call for log on above, one for the refresh token
            expect(http.urls.length).toBe(2);

            done();
          });
      });
  });

  it ('should throw on invalid refresh token', done => {
    http.status = 200;
    http.urls = [];
    sut.logOn("email", "password")
      .then(response => {
        sut.accessTokenExpires = new Date();
        http.status = 400;
        sut.invoke(() => fail("Invoke should not be called"), "http")
          .then(response => {
            fail("invoke should not be called ")
            // One call for log on above, one for the refresh token
            expect(http.urls.length).toBe(2);

          })
          .catch(error => {
            // Yeah, baby
            done();
          })
      });
  });

});
