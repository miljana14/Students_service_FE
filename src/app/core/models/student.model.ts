import { City } from './city.model';
export interface Student{
  indexNumber: string;
  indexYear: number;
  firstName: string;
  lastName: string;
  email?: string;
  address?: string;
  postalCode?: City;
  currentYearOfStudy?: number;
  username: string;
  password: string;
}
