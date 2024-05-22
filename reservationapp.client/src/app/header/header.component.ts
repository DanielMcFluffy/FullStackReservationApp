import { Component, DoCheck } from '@angular/core';
import { AccountsService } from '../shared/accounts.service';
import { TokenService } from '../shared/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements DoCheck {
  constructor(
    private accountService: AccountsService,
    private tokenService: TokenService
  ) {}
  isLogin!: boolean;

  ngDoCheck(): void {
    this.isLogin = Boolean(this.tokenService.getToken());
  }

  onLogout() {
    this.accountService.logoutAccount();
  }
}
