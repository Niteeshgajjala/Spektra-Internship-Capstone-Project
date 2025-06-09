// src/app/services/user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userId = '';
  private _userName = '';
  private _poolId = '';

  setUser(userId: string, userName: string, poolId: string): void {
    this._userId = userId;
    this._userName = userName;
    this._poolId = poolId;
  }

  get userId(): string {
    return this._userId;
  }

  get userName(): string {
    return this._userName;
  }

  get poolId(): string {
    return this._poolId;
  }

  clearUser(): void {
    this._userId = '';
    this._userName = '';
    this._poolId = '';
  }
}
