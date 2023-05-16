import { Client, Databases, ID, Query } from 'appwrite';
import Student from '../interfaces/Student';
import Time from '../interfaces/Time';

const databaseId = process.env.REACT_APP_APPWRITE_DATABASE ?? '';
const studentTableId = process.env.REACT_APP_APPWRITE_TABLE_STUDENT ?? '';
const timeTableId = process.env.REACT_APP_APPWRITE_TABLE_TIME ?? '';

const client = new Client();

client
	.setEndpoint(process.env.REACT_APP_APPWRITE_API ?? '')
	.setProject(process.env.REACT_APP_APPWRITE_PROJECT ?? '');

const databases = new Databases(client);

const AppwriteService = {
	getStudentsList: async () => {
		return await databases.listDocuments(databaseId, studentTableId, [
			Query.orderAsc('last_name'),
		]);
	},
	getStudent: async (studentId: string) => {
		return await databases.getDocument(databaseId, studentTableId, studentId);
	},
	getStudentByName: async (firstName: string | undefined, lastName: string | undefined) => {
		return await databases.listDocuments(databaseId, studentTableId, [
			Query.equal('last_name', lastName ?? ''),
		]);
	},
	createStudent: async (student: Student) => {
		return await databases.createDocument(databaseId, studentTableId, ID.unique(), {
			'first_name': student.firstName,
			'last_name': student.lastName,
			'start_time': student.startTime,
			'end_time': student.endTime,
			'birth_date': student.birthDate,
		});
	},
	editStudent: async (studentId: string, student: Student) => {
		return await databases.updateDocument(databaseId, studentTableId, studentId, {
			'first_name': student.firstName,
			'last_name': student.lastName,
			'start_time': student.startTime,
			'end_time': student.endTime,
			'birth_date': student.birthDate,
		});
	},
	removeStudent: async (studentId: string) => {
		return await databases.deleteDocument(databaseId, studentTableId, studentId);
	},
	getTimesList: async () => {
		return await databases.listDocuments(databaseId, timeTableId, [
			Query.orderAsc('time_slot'),
		]);
	},
	getTime: async (timeId: string) => {
		return await databases.getDocument(databaseId, timeTableId, timeId);
	},
	createTime: async (time: Time) => {
		return await databases.createDocument(databaseId, timeTableId, ID.unique(), {
			'time_slot': time.timeSlot,
		});
	},
	editTime: async (timeId: string, time: Time) => {
		return await databases.updateDocument(databaseId, timeTableId, timeId, {
			'time_slot': time.timeSlot,
		});
	},
	removeTime: async (timeId: string) => {
		return await databases.deleteDocument(databaseId, timeTableId, timeId);
	},
};

export default AppwriteService;
