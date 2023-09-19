import { Exam } from "./exam.model";
import { Student } from "./student.model";

export interface Mark{
    id?: number;
    student: Student;
    exam: Exam;
    mark: number;
}