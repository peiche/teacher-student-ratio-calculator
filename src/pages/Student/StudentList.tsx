import { Typography, Box, Button, Link as MuiLink } from "@mui/material";
import { useEffect, useState } from "react";
import StudentTable from "../../components/StudentTable/StudentTable";
import Wrapper from "../../components/Wrapper/Wrapper";
import Student from "../../interfaces/Student";
import AppwriteService from "../../services/AppwriteService";
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../constants/Routes";
import Spinner from "../../components/Spinner/Spinner";

const StudentList = () => {
	const navigate = useNavigate();
	const [students, setStudents] = useState<Array<Student>>([]);
	const [loading, setLoading] = useState(true);

	const loadStudents = () => {
		setStudents([]);

		AppwriteService.getStudentsList()
			.then(response => {
				response.documents.forEach(doc => {
					const student: Student = {} as Student;
					student.id = doc.$id;
					student.firstName = doc.first_name;
					student.lastName = doc.last_name;
					student.birthDate = doc.birth_date;
					student.startTime = doc.start_time;
					student.endTime = doc.end_time;

					setStudents(students => [...students, student]);
				});

				setLoading(false);
			});
	};

	useEffect(() => {
		loadStudents();
	},
		// eslint-disable-next-line
		[]);

	const handleNewStudent = () => {
		navigate(`${ROUTES.STUDENT}/new`);
	};

	return (
		<Wrapper>
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography component='h1' variant='h4'>
					Students
				</Typography>

				<Button variant="contained" onClick={handleNewStudent} startIcon={<AddIcon />}>New Student</Button>
			</Box>

			{loading &&
				<Spinner />
			}
			{!loading &&
				<>
					{students.length > 0 &&
						<StudentTable students={students} setStudents={setStudents} />
					}
					{students.length === 0 &&
						<Typography sx={{ mt: 2 }}>There are no students. <MuiLink component={Link} to={`${ROUTES.STUDENT}/new`}>Create one now.</MuiLink></Typography>
					}
				</>
			}
		</Wrapper>
	);
};

export default StudentList;
