import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registrationForm = fb.group(
      {
        name: [
          '',
          [Validators.required, Validators.pattern('[a-zA-Z]+[ ][a-zA-Z]+')],
        ],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$'),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.matchPasswords('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {}

  // getters
  get name() {
    return this.registrationForm.get('name');
  }
  get username() {
    return this.registrationForm.get('username');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  matchPasswords(password: any, confirmPassword: any) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['matchPasswords']
      ) {
        return;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ matchPasswords: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  addUser() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
      var data = {
        name: this.registrationForm.value.name,
        username: this.registrationForm.value.username,
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password,
      };
      console.log(data);
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/api/signup',
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      this.http
        .post<any>(req.url, req.data, { headers: req.headers })
        .subscribe((res) => {
          console.log('res--', res);
          if (res.data[0].boolean) {
            Swal.fire({
              icon: 'success',
              title: 'Successfully registered!',
            });
            this.router.navigate(['login']);
          }
        });
    }
  }
}
