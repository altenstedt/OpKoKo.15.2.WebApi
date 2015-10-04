import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {TokenService} from './token-service';

@inject(HttpClient,TokenService)
export class UserService {
    baseUrl = "https://your.api";

    constructor(http, tokenService) {
      this.http = http;
      this.tokenService = tokenService;
    }

    getUsers(nextPartitionKey, nextRowKey, count) {
        let url = `${this.baseUrl}/api/users?nextPartitionKey=${nextPartitionKey || ""}&nextRowKey=${nextRowKey || ""}&count=${count || 100}`;

        return this.tokenService.invoke((accessToken) => {
            return this.http.fetch(url, {
                mode: "cors",
                method: "get",
                headers: { "Authorization": "Bearer " + accessToken }
            })
        },
        `GET ${url} HTTP/1.1`);
    }

    getUser(email) {
        let url = `${this.baseUrl}/api/users?email=${email}`;

        return this.tokenService.invoke((accessToken) => {
            return this.http.fetch(url, {
                mode: "cors",
                method: "get",
                headers: { "Authorization": "Bearer " + accessToken }
            })
        },
        `GET ${url} HTTP/1.1`);
    }

    addUser(fullName, email, claims) {
        let url = `${this.baseUrl}/api/users/add`;

        return this.tokenService.invoke((accessToken) => {
            let content = {
                "FullName": fullName,
                "Email": email,
                "Claims": JSON.stringify(claims) // Send as a string
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

    updateUser(user) {
      let url = `${this.baseUrl}/api/users`;

      return this.tokenService.invoke((accessToken) => {
          return this.http.fetch(url, {
              mode: "cors",
              method: "post",
              headers: { "Authorization": "Bearer " + accessToken, "Content-Type": "application/json" },
              body: JSON.stringify(user)
          })
      },
      `POST ${url} HTTP/1.1`);
    }
}
