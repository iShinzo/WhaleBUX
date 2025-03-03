import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  username: string;
  wbuxBalance: number;
  wbuxDollars: number;
  level: number;
  experience: number;
  lastMiningTime: number | null;
  miningStreak: number;
  lastLoginDate: string | null;
}

export class WhaleBuxDB extends Dexie {
  users!: Table<User>;

  constructor() {
    super('WhaleBuxDB');
    this.version(1).stores({
      users: '++id, username'
    });
  }

  async getCurrentUser(): Promise<User | undefined> {
    const users = await this.users.toArray();
    return users[0]; // For now, just get the first user
  }

  async createOrUpdateUser(userData: Partial<User>): Promise<number> {
    const currentUser = await this.getCurrentUser();
    if (currentUser) {
      await this.users.update(currentUser.id!, userData);
      return currentUser.id!;
    } else {
      return await this.users.add({
        username: 'user123',
        wbuxBalance: 0,
        wbuxDollars: 0,
        level: 1,
        experience: 0,
        lastMiningTime: null,
        miningStreak: 4,
        lastLoginDate: null,
        ...userData
      });
    }
  }
}