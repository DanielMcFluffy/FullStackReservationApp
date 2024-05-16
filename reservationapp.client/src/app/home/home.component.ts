import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../shared/accounts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private accountsService: AccountsService) {}

  ngOnInit(): void {
    const refreshToken = this.accountsService.getRefreshToken();
    // console.log(refreshToken);
    if (refreshToken) {
      this.accountsService
        .requestRefreshToken(refreshToken)
        .subscribe((newAccessToken) => {
          const { token } = newAccessToken;
          localStorage.setItem('accessToken', token);
          console.log(token);
        });
    }
  }
}
