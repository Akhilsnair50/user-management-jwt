import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';

import { Observable } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  PATH_OF_API = 'http://localhost:9090';

  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });

  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  public login(loginData: any) {
    return this.httpClient.post(this.PATH_OF_API + '/authenticate', loginData, {
      headers: this.requestHeader,
    });
  }

  public forUser() {
    return this.httpClient.get(this.PATH_OF_API + '/forUser', {
      responseType: 'text',
    });
  }

  public forAdmin() {
    return this.httpClient.get(this.PATH_OF_API + '/forAdmin', {
      responseType: 'text',
    });
  }

  public roleMatch(allowedRoles: any): boolean {
    const userRoles: any[] = this.userAuthService.getRoles();

    if (userRoles.length > 0 && userRoles) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i].roleName === allowedRoles[j]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public register(user: User): Observable<User> {
    const url = this.PATH_OF_API + '/registerNewUser';
    console.log(user);
    return this.httpClient.post<User>(url, user);
  }

  getUsers():Observable<User[]>{
    return this.httpClient.get<User[]>(this.PATH_OF_API+'/getUsers')
  }

  isUserNameAvailable(userName:string){
    const url = this.PATH_OF_API+`/check-username/${userName}`;
    return this.httpClient.get<boolean>(url);
  }

  findUserByUserName(userName:string):Observable<any>{
    const url = this.PATH_OF_API+`/find-by-userName/${userName}`;
    return this.httpClient.get<User>(url)
  }

  getImage(fileName:string):Observable<Blob>{
    return this.httpClient.get(this.PATH_OF_API+`/images/${fileName}`,{responseType:'blob'});
  }

  updateUser(user:User){
    return this.httpClient.put<User>(this.PATH_OF_API+`/users/${user.userName}`,user);
  }
}
