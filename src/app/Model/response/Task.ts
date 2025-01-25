export class Task {
	tId : number;

	tPool  : number;
	tName  : string;
	tClient  : string;
	tInfo  : string;
	tEmail  : string;

	tPickedBy : Map<string, number>;

	tReportDate : Date;
	tResolutionDate : Date;

	tTag : string[];

	tPriority  : number;
	tStatus  : number;
	tSolution : string;
}