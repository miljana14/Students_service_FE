import { Professor, Subject, ExaminationPeriod } from 'src/app/core/models';
export interface Exam{
	id: number;
  	examinationPeriod: ExaminationPeriod;
	subject: Subject;
	professor: Professor;
	examDate: Date;
	isSelected: boolean;
}

