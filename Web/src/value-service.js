import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {TokenService} from './token-service';

@inject(HttpClient, TokenService)
export class ValueService {
    baseUrl = "https://your-secured.api";

    constructor(http, tokenService) {
      this.http = http;
      this.tokenService = tokenService;
    }

    getValue(id) {
        let url = `${this.baseUrl}/api/values?id=${id}`;

        return this.tokenService.invoke((accessToken) => {
            return this.http.fetch(url, {
                mode: "cors",
                method: "get",
                headers: { "Authorization": "Bearer " + accessToken }
            })
        },
        `GET ${url} HTTP/1.1`);
    }

    addValue(value) {
        let url = `${this.baseUrl}/api/values`;

        return this.tokenService.invoke((accessToken) => {
            let content = {
                "value": value
              };

            return this.http.fetch(url, {
                mode: "cors",
                method: "post",
                headers: { "Authorization": "Bearer " + accessToken, "Content-Type": "application/json" },
                body: JSON.stringify(content)
            })
        },
        `POST ${url} HTTP/1.1`);
    }
}
