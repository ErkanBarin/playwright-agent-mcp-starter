/**
 * Test Data Factory
 *
 * Generates realistic, unique test data for use in UI and API tests.
 * Each function returns a fresh object with randomized values to
 * prevent test pollution and ensure uniqueness across parallel runs.
 *
 * @example
 *   import { TestData } from '../utils/data-factory';
 *
 *   const user = TestData.user();
 *   const admin = TestData.user({ role: 'admin' });
 *   const product = TestData.product({ price: 99.99 });
 */

/** Generate a short unique suffix based on timestamp + random chars. */
function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Generate a random integer between min and max (inclusive). */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a random element from an array. */
function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  inStock: boolean;
}

export interface OrderData {
  orderId: string;
  status: string;
  items: number;
  total: number;
  currency: string;
}

// ---------------------------------------------------------------------------
// Seed data pools
// ---------------------------------------------------------------------------

const FIRST_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank', 'Iris', 'Jack'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor'];
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Seattle', 'Denver', 'Austin', 'Boston', 'Miami'];
const STATES = ['NY', 'CA', 'IL', 'TX', 'AZ', 'WA', 'CO', 'TX', 'MA', 'FL'];
const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Health'];
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

export const TestData = {
  /** Generate a unique user with optional overrides. */
  user(overrides: Partial<UserData> = {}): UserData {
    const id = uid();
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);
    return {
      firstName,
      lastName,
      email: `test.${firstName.toLowerCase()}.${id}@example.com`,
      password: `P@ssw0rd!${id}`,
      role: 'user',
      phone: `+1${randomInt(200, 999)}${randomInt(1000000, 9999999)}`,
      ...overrides,
    };
  },

  /** Generate a unique address with optional overrides. */
  address(overrides: Partial<AddressData> = {}): AddressData {
    const idx = randomInt(0, CITIES.length - 1);
    return {
      street: `${randomInt(100, 9999)} ${randomFrom(LAST_NAMES)} St`,
      city: CITIES[idx],
      state: STATES[idx],
      zip: `${randomInt(10000, 99999)}`,
      country: 'US',
      ...overrides,
    };
  },

  /** Generate a unique product with optional overrides. */
  product(overrides: Partial<ProductData> = {}): ProductData {
    const id = uid();
    return {
      name: `Test Product ${id}`,
      description: `A test product created for automated testing (${id})`,
      price: Number((Math.random() * 200 + 1).toFixed(2)),
      sku: `SKU-${id.toUpperCase()}`,
      category: randomFrom(CATEGORIES),
      inStock: Math.random() > 0.2,
      ...overrides,
    };
  },

  /** Generate a unique order with optional overrides. */
  order(overrides: Partial<OrderData> = {}): OrderData {
    const items = randomInt(1, 10);
    return {
      orderId: `ORD-${uid().toUpperCase()}`,
      status: randomFrom(ORDER_STATUSES),
      items,
      total: Number((items * (Math.random() * 100 + 5)).toFixed(2)),
      currency: 'USD',
      ...overrides,
    };
  },

  /** Generate a random valid email. */
  email(prefix = 'test'): string {
    return `${prefix}.${uid()}@example.com`;
  },

  /** Generate a random strong password. */
  password(): string {
    return `P@ssw0rd!${uid()}`;
  },

  /** Generate a random string of specified length (useful for boundary testing). */
  randomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  },

  /** Generate a past date within the last N days (ISO string). */
  pastDate(withinDays = 365): string {
    const now = Date.now();
    const offset = randomInt(1, withinDays) * 24 * 60 * 60 * 1000;
    return new Date(now - offset).toISOString();
  },

  /** Generate a future date within the next N days (ISO string). */
  futureDate(withinDays = 365): string {
    const now = Date.now();
    const offset = randomInt(1, withinDays) * 24 * 60 * 60 * 1000;
    return new Date(now + offset).toISOString();
  },
} as const;
