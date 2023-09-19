import { BooleanValues } from './../enums/enums';
export interface ExaminationPeriod{
  	id: number;
	name: string;
	beginDate: Date;
	endDate: Date;
	active: BooleanValues;
}
