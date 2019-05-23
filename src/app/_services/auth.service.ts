import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'Users/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;

constructor(private http: HttpClient) { }

login(model: any) {
  return this.http.post(this.baseUrl + 'Authenticate', model)
  .pipe(
    map((response: any) => {
      const user = response;
      if (user) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user.user));
        this.currentUser = user.user;
        this.decodedToken = this.jwtHelper.decodeToken(user.token);
      }
    })
  );
}

register(user: User) {
  return this.http.post(this.baseUrl + 'Register', user);
}

loggedIn() {
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}
}
