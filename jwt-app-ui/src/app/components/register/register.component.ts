import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  isAvailable: boolean = true;
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      userName: ['', Validators.required],
      userPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;
      this.userService.register(user).subscribe(
        (response) => {
          Swal.fire('User registered successfully');
          this.registerForm.reset();
        },
        (error) => {
          console.error('error', error);
          Swal.fire({
            title: 'Error!',
            text: 'Do you want to continue',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        }
      );
    }
  }

  checkUserName() {
    const userName = this.registerForm.get('userName')?.value;

    if (userName) {
      this.userService
        .isUserNameAvailable(userName)
        .subscribe((isAvailable) => {
          if (isAvailable) {
            this.onSubmit();/// I submitted the form if no other users exists
          } else {
            isAvailable = false;
            Swal.fire('Username is not available');
          }
        });
    }
  }
}
