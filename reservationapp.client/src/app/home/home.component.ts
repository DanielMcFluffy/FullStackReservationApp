import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../shared/accounts.service';
import { TokenService } from '../shared/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    this.tokenService.requestRefreshToken().subscribe((authData) => {
      const { refreshToken } = authData!;
      localStorage.setItem('refreshToken', refreshToken!);
    });
  }
}
