import { Box, Button, FormControl, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Wrapper from "../../components/Wrapper/Wrapper";
import Student from "../../interfaces/Student";
import AppwriteService from "../../services/AppwriteService";
import ROUTES from "../../constants/Routes";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from "../../components/TextField/TextField";
import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import { Utils } from "../../helpers/Utils";

const StudentEdit = () => {
	// eslint-disable-next-line
	const [searchParams, setSearchParams] = useSearchParams();

	const navigate = useNavigate();
	const { id } = useParams();

	// eslint-disable-next-line
	const [student, setStudent] = useState<Student>();

	const [firstName, setFirstName] = useState<string>();
	const [lastName, setLastName] = useState<string>();
	const [startTime, setStartTime] = useState<string>();
	const [endTime, setEndTime] = useState<string>();
	const [birthDate, setBirthDate] = useState<string>();
	const [hideSidebar, setHideSidebar] = useState(false);
	const [existingError, setExistingError] = useState(false);
	const [existingUserId, setExistingUserId] = useState('');
	const [timeError, setTimeError] = useState(false);

	useEffect(() => {
		if (searchParams.get('refer') === 'popup') {
			setHideSidebar(true);
		}
	}, [searchParams]);

	useEffect(() => {
		setExistingError(false);

		if (id && id !== 'new') {
			AppwriteService.getStudent(id)
				.then(response => {
					const studentTemp: Student = {} as Student;
					studentTemp.firstName = response.first_name;
					studentTemp.lastName = response.last_name;
					studentTemp.birthDate = response.birth_date;
					studentTemp.startTime = response.start_time;
					studentTemp.endTime = response.end_time;

					setFirstName(response.first_name);
					setLastName(response.last_name);
					setBirthDate(response.birth_date);
					setStartTime(response.start_time);
					setEndTime(response.end_time);

					setStudent(studentTemp);
				});
		}
	}, [id]);

	const handleCancel = () => {
		handleNavigateAway();
	};

	const handleNavigateAway = () => {
		if (!hideSidebar) {
			navigate(ROUTES.STUDENT);
		} else {
			window.open("about:blank", "_self");
			window.close();
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setTimeError(false);
		setExistingError(false);

		if (startTime && endTime && Utils.parseTime(endTime) < Utils.parseTime(startTime)) {
			setTimeError(true);
			return;
		}

		if (id && id !== 'new') {
			AppwriteService.editStudent(id, {
				id: id,
				firstName: firstName ?? '',
				lastName: lastName ?? '',
				startTime: startTime ?? '',
				endTime: endTime ?? '',
				birthDate: birthDate ?? '',
			})
				.then(response => {
					handleNavigateAway();
				});
		} else {
			AppwriteService.getStudentByName(firstName, lastName)
				.then(response => {
					if (response.documents.length > 0) {
						setExistingError(true);
						setExistingUserId(response.documents[0].$id)
					} else {
						AppwriteService.createStudent({
							id: '',
							firstName: firstName ?? '',
							lastName: lastName ?? '',
							startTime: startTime ?? '',
							endTime: endTime ?? '',
							birthDate: birthDate ?? '',
						})
							.then(response => {
								handleNavigateAway();
							})
							.catch(error => console.log(error));
					}
				})
				.catch(error => console.log(error));
		}
	};

	return (
		<Wrapper hideSidebar={hideSidebar}>
			{!hideSidebar &&
				<Box sx={{ mb: 1 }}>
					<Button component={Link} to={ROUTES.STUDENT} startIcon={<ArrowBackIcon />}>All Students</Button>
				</Box>
			}

			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography component='h1' variant='h4'>
					{id === 'new' ? 'Add' : 'Edit'} Student
				</Typography>
			</Box>

			<form onSubmit={handleSubmit}>
				<Box sx={{ my: 1 }}>
					<Grid container spacing={3}>
						{existingError &&
							<Grid xs={12}>
								<Alert severity="error">
									A user already exists with this name. Do you want to{` `}
									<MuiLink component={Link} to={`${ROUTES.STUDENT}/${existingUserId}`} sx={{ color: 'inherit' }}>edit it</MuiLink>?
								</Alert>
							</Grid>
						}

						{timeError &&
							<Grid xs={12}>
								<Alert severity="error">
									The end time must be after the start time.
								</Alert>
							</Grid>
						}

						<Grid xs={12} md={6}>
							<FormControl fullWidth>
								<TextField variant='standard' InputLabelProps={{ shrink: true }} label='First Name' value={firstName || ''} onChange={event => setFirstName(event.target.value)} autoComplete='off' required autoFocus />
							</FormControl>
						</Grid>
						<Grid xs={12} md={6}>
							<FormControl fullWidth>
								<TextField variant='standard' InputLabelProps={{ shrink: true }} label='Last Name' value={lastName || ''} onChange={event => setLastName(event.target.value)} autoComplete='off' required />
							</FormControl>
						</Grid>
						<Grid xs={12} md={6}>
							<FormControl fullWidth>
								<TextField type='time' variant='standard' InputLabelProps={{ shrink: true }} label='Start Time' value={startTime || ''} onChange={event => setStartTime(event.target.value)} autoComplete='off' required />
							</FormControl>
						</Grid>
						<Grid xs={12} md={6}>
							<FormControl fullWidth>
								<TextField type='time' variant='standard' InputLabelProps={{ shrink: true }} label='End Time' value={endTime || ''} onChange={event => setEndTime(event.target.value)} autoComplete='off' required />
							</FormControl>
						</Grid>
						<Grid xs={12} md={6}>
							<FormControl fullWidth>
								<TextField type='date' variant='standard' InputLabelProps={{ shrink: true }} label='Birth Date' value={birthDate || ''} onChange={event => setBirthDate(event.target.value)} autoComplete='off' required />
							</FormControl>
						</Grid>
					</Grid>
				</Box>

				<Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
					<Button variant="contained" type='submit'>Save</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</Box>
			</form>
		</Wrapper>
	);
};

export default StudentEdit;
