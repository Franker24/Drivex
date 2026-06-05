// Centralized LocalStorage Database & Session Management Service
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
  createdAt: string;
}

export interface Booking {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  carId: string;
  carName: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface GarageItem {
  id: string;
  userId: string;
  carId: string;
  carName: string;
  paint: { name: string; hex: string; price: number };
  wheels: { name: string; price: number };
  interior: { name: string; price: number };
  totalPrice: number;
  createdAt: string;
}

class LocalDatabase {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`drivex_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from storage`, e);
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`drivex_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to storage`, e);
    }
  }

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Populate default users if empty
    const users = this.getStorage<User[]>('users', []);
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: 'u-admin-1',
          email: 'admin@drivex.com',
          name: 'Concierge Admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 'u-client-1',
          email: 'client@drivex.com',
          name: 'John Doe',
          role: 'client',
          createdAt: new Date().toISOString()
        }
      ];
      this.setStorage('users', defaultUsers);
    }

    // Populate default bookings if empty
    const bookings = this.getStorage<Booking[]>('bookings', []);
    if (bookings.length === 0) {
      const defaultBookings: Booking[] = [
        {
          id: 'b-1',
          userId: 'u-client-1',
          name: 'John Doe',
          email: 'client@drivex.com',
          phone: '+1 (555) 0199',
          carId: 'porsche-911-gt3',
          carName: 'Porsche 911 GT3',
          date: '2026-06-15',
          timeSlot: '10:00 AM - 12:00 PM',
          status: 'approved',
          notes: 'Prefer to drive on the highway section.',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'b-2',
          name: 'Jane Smith',
          email: 'janesmith@example.com',
          phone: '+1 (555) 0144',
          carId: 'tesla-model-s-plaid',
          carName: 'Tesla Model S Plaid',
          date: '2026-06-18',
          timeSlot: '02:00 PM - 04:00 PM',
          status: 'pending',
          notes: 'Interested in comparing autopilot features.',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      this.setStorage('bookings', defaultBookings);
    }

    // Populate default inquiries if empty
    const inquiries = this.getStorage<Inquiry[]>('inquiries', []);
    if (inquiries.length === 0) {
      const defaultInquiries: Inquiry[] = [
        {
          id: 'i-1',
          name: 'Robert Davis',
          email: 'robert@davis.com',
          subject: 'Financing details for McLaren Artura',
          message: 'Hello, I would like to inquire about the maximum financing term available for the McLaren Artura. Do you offer custom leasing contracts for corporations?',
          status: 'unread',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'i-2',
          name: 'Sarah Connor',
          email: 'sarah.c@cyberdyne.com',
          subject: 'Armored options request',
          message: 'Do you provide specialized armoring packages for SUV models or custom luxury sportcars in your fleet?',
          status: 'read',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ];
      this.setStorage('inquiries', defaultInquiries);
    }

    // Populate default garage if empty
    const garage = this.getStorage<GarageItem[]>('garage', []);
    if (garage.length === 0) {
      const defaultGarage: GarageItem[] = [
        {
          id: 'g-1',
          userId: 'u-client-1',
          carId: 'porsche-911-gt3',
          carName: 'Porsche 911 GT3',
          paint: { name: 'Python Green', hex: '#00FF44', price: 3200 },
          wheels: { name: '20/21" GT3 RS Forged', price: 4500 },
          interior: { name: 'Race-Tex Alcantara Black with Green stitching', price: 2900 },
          totalPrice: 193500,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      this.setStorage('garage', defaultGarage);
    }
  }

  // --- Auth / User Methods ---
  getUsers(): User[] {
    return this.getStorage<User[]>('users', []);
  }

  register(email: string, name: string): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return existing;
    }
    const newUser: User = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      email: email.trim(),
      name: name.trim(),
      role: email.toLowerCase().includes('admin') ? 'admin' : 'client',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.setStorage('users', users);
    return newUser;
  }

  getCurrentUser(): User | null {
    return this.getStorage<User | null>('current_user', null);
  }

  setCurrentUser(user: User | null): void {
    this.setStorage('current_user', user);
    // Dispatch a custom event to notify components of auth changes
    window.dispatchEvent(new Event('auth_change'));
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  // --- Booking Methods ---
  getBookings(): Booking[] {
    return this.getStorage<Booking[]>('bookings', []);
  }

  addBooking(bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...bookingData,
      id: `b-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    this.setStorage('bookings', bookings);
    return newBooking;
  }

  updateBookingStatus(id: string, status: 'pending' | 'approved' | 'rejected'): void {
    const bookings = this.getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === id);
    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = status;
      this.setStorage('bookings', bookings);
    }
  }

  deleteBooking(id: string): void {
    const bookings = this.getBookings();
    const filtered = bookings.filter(b => b.id !== id);
    this.setStorage('bookings', filtered);
  }

  // --- Inquiry Methods ---
  getInquiries(): Inquiry[] {
    return this.getStorage<Inquiry[]>('inquiries', []);
  }

  addInquiry(inquiryData: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Inquiry {
    const inquiries = this.getInquiries();
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `i-${Math.random().toString(36).substr(2, 9)}`,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    inquiries.unshift(newInquiry);
    this.setStorage('inquiries', inquiries);
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: 'unread' | 'read' | 'archived'): void {
    const inquiries = this.getInquiries();
    const inquiryIndex = inquiries.findIndex(i => i.id === id);
    if (inquiryIndex !== -1) {
      inquiries[inquiryIndex].status = status;
      this.setStorage('inquiries', inquiries);
    }
  }

  deleteInquiry(id: string): void {
    const inquiries = this.getInquiries();
    const filtered = inquiries.filter(i => i.id !== id);
    this.setStorage('inquiries', filtered);
  }

  // --- Garage Methods ---
  getGarage(): GarageItem[] {
    return this.getStorage<GarageItem[]>('garage', []);
  }

  getGarageForUser(userId: string): GarageItem[] {
    return this.getGarage().filter(item => item.userId === userId);
  }

  addGarageItem(itemData: Omit<GarageItem, 'id' | 'createdAt'>): GarageItem {
    const garage = this.getGarage();
    const newItem: GarageItem = {
      ...itemData,
      id: `g-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    garage.unshift(newItem);
    this.setStorage('garage', garage);
    return newItem;
  }

  deleteGarageItem(id: string): void {
    const garage = this.getGarage();
    const filtered = garage.filter(item => item.id !== id);
    this.setStorage('garage', filtered);
  }
}

export const db = new LocalDatabase();
