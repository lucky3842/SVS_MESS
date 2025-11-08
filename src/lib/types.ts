export interface DailyEntry {
  id: string;
  date: Date;
  morningCount: number;
  nightCount: number;
  attendance: number;
  items: Product[];
}

export interface Product {
  id: string;
  name: string;
  quantity: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  userName: string;
  avatar: string;
}
