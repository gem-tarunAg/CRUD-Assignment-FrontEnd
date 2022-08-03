import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  newUser: any = {};
  showData: boolean = true;
  showEnable: boolean = true;
  disableInput: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const usernameFromRoute = routeParams.get('username');
    // console.log(usernameFromRoute);

    var req = {
      method: 'GET',
      url: 'http://localhost:3000/api/profile/' + usernameFromRoute,
    };

    this.http.get<any>(req.url).subscribe(
      (res) => {
        // console.log('res---', res);
        if (res.data[0].boolean) {
          this.showData = true;
          this.user = res.data[1];
          this.newUser = this.user;
          // console.log('USER---', this.user);
        } else {
          this.showData = false;
        }
      },
      (err) => {
        // console.log('ERROR---',err);
        this.showData = false;
      }
    );
  }

  enableButton() {
    this.disableInput = false;
    this.showEnable = false;
    // console.log(this.newUser);
  }

  updateUser() {
    console.log(this.newUser);
    var req = {
      method: 'PUT',
      data: {
        name: this.newUser.name,
        username: this.newUser.username,
        email: this.newUser.email,
      },
      url: 'http://localhost:3000/api/profile/' + this.user._id,
    };

    console.log('DATA---', req.data);

    this.http.put<any>(req.url, req.data).subscribe(
      (res) => {
        console.log(res);
        if (res.data[0].boolean) {
          Swal.fire({
            icon: 'success',
            title: 'Updated User Profile Successfully',
          });

          this.router.navigate(['profile', { username: res.data[1].username }]);

          this.showEnable = true;
          this.disableInput = true;
        }
      },
      (err) => {
        console.log('ERROR--', err);
        Swal.fire({
          icon: 'error',
          title: 'Some error in updation',
        });
      }
    );
  }
  deleteUser() {
    Swal.fire({
      icon: 'question',
      title: 'Are you Sure?',
      text: "Once user is deletd you can't login with that credentials",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      cancelButtonColor: '#C7303E',
      confirmButtonColor: '#0D6EFD',
    }).then((result) => {
      if (result.value) {
        var req = {
          method: 'DELETE',
          url: 'http://localhost:3000/api/profile/' + this.user._id,
        };

        this.http.delete<any>(req.url).subscribe(
          (res) => {
            console.log(res);
            if (res.data[0].boolean) {
              Swal.fire({
                icon: 'success',
                title: 'Succesfully deleted this user',
              });
              this.router.navigate(['login']);
            }
          },
          (err) => {
            console.log('ERROR--', err);
            Swal.fire({
              icon: 'error',
              title: "User Can't Be deleted",
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your profile is safe :)', 'error');
      }
    });
  }
}
