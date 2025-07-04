

export interface User {
  id:            number;
  attributes:    Attributes;
}

export interface Attributes {
  email: string;
  name: string;
  last_name: string;
  phone: string;
  address: string;
  created_at: Date;
  updated_at: Date;
}
