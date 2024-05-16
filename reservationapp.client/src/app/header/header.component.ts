import { Component, DoCheck } from '@angular/core';
import { AccountsService } from '../shared/accounts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements DoCheck {
  constructor(private accountService: AccountsService) {}
  isLogin!: boolean;

  ngDoCheck(): void {
    this.isLogin = Boolean(this.accountService.getToken());
  }

  onLogout() {
    this.accountService.logoutAccount();
  }
}
