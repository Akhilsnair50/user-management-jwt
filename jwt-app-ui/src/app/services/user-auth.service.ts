import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor() {}

  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): string[] {
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles != null) {
      return JSON.parse(storedRoles);
    } else {
      return [];
    }
  }

  public setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }

  public getToken(): string {
    const jwtToken = localStorage.getItem('jwtToken');

    if (jwtToken != null) {
      return jwtToken;
    } else {
      return '';
    }
  }

  public clear(){
    localStorage.clear();
  }

  public isLoggedIn(){
    return this.getRoles() && this.getToken();
  }

  public setUserName(userName:string){
    localStorage.setItem('userName',userName);
  }

  public getUserName(){
    const userName = localStorage.getItem('userName');
    return userName;
  }
}
