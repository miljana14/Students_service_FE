import { SemesterOption } from "../enums";

export interface Subject{
  id: number;
  name: string;
  description: string;
  noOfESP: number;
  yearOfStudy : number;
  semester: SemesterOption;
}
