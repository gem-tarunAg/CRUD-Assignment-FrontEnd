import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public userDetails: any = {};
  public registeredUser: any = {};
  public showMessage: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.userDetails = {
      username: '',
      password: '',
    };
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      // console.log('val--', form.value);
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/api/login',
        data: JSON.stringify(form.value),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      // console.log('data---', req.data);

      this.http
        .post<any>(req.url, req.data, { headers: req.headers })
        .subscribe(
          (res) => {
            //   console.log('res---', res);
            //   console.log('BOOL--', res.data[0]);
            //   console.log(res.data[0].boolean);

            Swal.fire({
              icon: 'success',
              title: 'Successfully Logged In!',
            });
            this.router.navigate([
              'profile',
              { username: res.data[1].username },
            ]);
          },
          (err) => {
            // console.log('ERROR--', err);
            Swal.fire({
              icon: 'warning',
              title: 'Invalid Credentials',
            });
            form.resetForm();
          }
        );
    }
  }
}
