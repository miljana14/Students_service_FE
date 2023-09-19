import { Exam } from './exam.model';
import { Student } from './student.model';
export interface ExamApplication{
  id: number;
	student: Student;
	date: Date;
	exams: Exam[];
}
