export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'searcher' | 'provider' | 'admin';
  company?: string;
  website?: string;
  createdAt: Date;
}
