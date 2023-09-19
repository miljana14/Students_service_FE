import { City, Exam, Subject, Title } from ".";

export interface Professor{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  postalCode: City;
  phone: string;
  reelectionDate: Date;
  title: Title;
  subjects: Subject[];
  exams: Exam[];
  username: string;
  password: string;
}
