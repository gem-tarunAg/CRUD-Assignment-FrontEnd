import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const usernameFromRoute = routeParams.get('username');
    console.log(usernameFromRoute);

    var req = {
      method: 'GET',
      url: 'http://localhost:3000/api/profile/' + usernameFromRoute,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    this.http.get<any>(req.url).subscribe((res) => {
      console.log('res---', res);
      this.user = res.data[1];
      console.log('USER---', this.user);
    });
  }
}
