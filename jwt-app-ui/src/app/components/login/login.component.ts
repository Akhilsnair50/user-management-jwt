import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  @Output() registerEmitter :EventEmitter<any> = new EventEmitter()

  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router
  ) {}

  login(loginForm: NgForm) {
    console.log('form is submitted');
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        // console.log(response.jwtToken);
        // console.log(response.user.role);
        // console.log(response.user.userName)

        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);
        this.userAuthService.setUserName(response.user.userName);

        const role = response.user.role[0].roleName;

        // console.log(role);

        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'credentials invalid',
          icon: 'error',
          confirmButtonText: 'ok'
        })
      }
    );
  }

  register(){
    this.registerEmitter.emit();
  }
}
