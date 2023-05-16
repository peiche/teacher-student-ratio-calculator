import dayjs from "dayjs";
import Student from "../interfaces/Student";

export const Utils = {
	calculateRatio: (birthDate: Date) => {
		let ratio = 0;

		const EPOCH = new Date(0);
		const EPOCH_YEAR = EPOCH.getUTCFullYear();
		const EPOCH_MONTH = EPOCH.getUTCMonth();

		const diff = new Date(Date.now() - birthDate.getTime());
		const diffYears = Math.abs(diff.getUTCFullYear() - EPOCH_YEAR);
		const diffMonths = Math.abs(diff.getUTCMonth() - EPOCH_MONTH);

		let decimal = 0;
		const diffMonthsTotal = (diffYears * 12) + diffMonths;
		if (diffMonthsTotal >= 60) {
			decimal = 0.06;
		} else if (diffMonthsTotal > 48) {
			decimal = 0.08;
		} else if (diffMonthsTotal > 36) {
			decimal = 0.1;
		} else if (diffMonthsTotal > 30) {
			decimal = 0.13;
		} else if (diffMonthsTotal > 24) {
			decimal = 0.17;
		} else {
			decimal = 0.25;
		}

		ratio += decimal;

		return ratio;
	},
	parseTime: (timeString: string) => {
		var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);
		var d = new Date();

		if (time) {
			var hours = parseInt(time[1], 10);
			if (hours === 12 && !time[4]) {
				hours = 0;
			}
			else {
				hours += (hours < 12 && time[4]) ? 12 : 0;
			}

			d.setHours(hours);
			d.setMinutes(parseInt(time[3], 10) || 0);
			d.setSeconds(0, 0);
		}

		return d;
	},
	isTimeCounted: (student: Student, time: string) => {
		return Utils.parseTime(student.startTime) <= Utils.parseTime(time)
			&& Utils.parseTime(student.endTime) > Utils.parseTime(time);
	},
	calculateStudentRatios: (students: Array<Student>, time: string) => {
		let studentNumber = 0;

		students.forEach((student: Student) => {
			if (Utils.isTimeCounted(student, time)) {
				studentNumber += Utils.calculateRatio(new Date(student.birthDate));
			}
		});

		return studentNumber.toFixed(2);
	},
	formatTime: (time: any) => {
		// Check correct time format and split into components
		time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

		if (time.length > 1) { // If time format correct
			time = time.slice(1);  // Remove full string match value
			time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
			time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join(''); // return adjusted time or original string
	},
	handleFilterMatch: (studentFilter: string, student: Student) => {
		if (studentFilter !== '') {
			if (student.firstName.toLowerCase().includes(studentFilter.toLowerCase())
				|| student.lastName.toLowerCase().includes(studentFilter.toLowerCase())
			) {
				return true;
			} else {
				return false;
			}
		}

		return true;
	},
	filePickerTypes: [
		{
			description: 'Text Files',
			accept: {
				'text/plain': ['.json'],
			},
		},
	],
	descendingComparator: function <T>(a: T, b: T, orderBy: keyof T) {
		if (b[orderBy] < a[orderBy]) {
			return -1;
		}
		if (b[orderBy] > a[orderBy]) {
			return 1;
		}
		return 0;
	},
	formatDate: (date: string) => {
		return dayjs(date).format('MM/DD/YYYY');
	},
	calculateAge: (dob: Date) => { 
		var diff_ms = Date.now() - dob.getTime();
		var age_dt = new Date(diff_ms); 
	  
		return Math.abs(age_dt.getUTCFullYear() - 1970);
	},
};
