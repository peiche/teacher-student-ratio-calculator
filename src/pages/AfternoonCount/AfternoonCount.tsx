import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Unstable_Grid2 as Grid, Box, Button, Snackbar, IconButton } from '@mui/material';
import ROUTES from '../../constants/Routes';
import AppwriteService from '../../services/AppwriteService';
import Student from '../../interfaces/Student';
import { Utils } from '../../helpers/Utils';
import Wrapper from "../../components/Wrapper/Wrapper";
import AfternoonCountCard from '../../components/AfternoonCountCard/AfternoonCountCard';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { selectGroups } from '../../redux/slices/groupsSlice';
import { useAppSelector } from '../../redux/hooks';
import Spinner from '../../components/Spinner/Spinner';
import Time from '../../interfaces/Time';

const AfternoonCount = () => {
	const navigate = useNavigate();
	const groups = useAppSelector(selectGroups);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [students, setStudents] = useState<Array<Student>>([]);
	const [times, setTimes] = useState<Array<Time>>([]);
	const [loading, setLoading] = useState(true);

	const loadStudents = () => {
		setStudents([]);

		AppwriteService.getStudentsList()
			.then(response => {
				response.documents.forEach((response: any) => {
					const student: Student = {} as Student;
					student.id = response.$id;
					student.firstName = response.first_name;
					student.lastName = response.last_name;
					student.startTime = response.start_time;
					student.endTime = response.end_time;
					student.birthDate = response.birth_date;

					setStudents(students => [...students, student]);
				});

				setLoading(false);
			});
	};

	const loadTimes = () => {
		setTimes([]);

		AppwriteService.getTimesList()
			.then(response => {
				response.documents.forEach(doc => {
					const time: Time = {} as Time;
					time.id = doc.$id;
					time.timeSlot = doc.time_slot;

					setTimes(times => [...times, time]);
				});
			});
	};

	useEffect(() => {
		console.log(times);
	}, [times]);

	useEffect(() => {
		loadStudents();
		loadTimes();
	},
		// eslint-disable-next-line
		[]
	);

	const handleModifyGroups = () => {
		navigate(ROUTES.HOME);
	};

	const handleExportResults = () => {
		const options: SaveFilePickerOptions = {
			types: Utils.filePickerTypes,
		};
		window.showSaveFilePicker(options)
			.then((handle: FileSystemFileHandle) => {
				handle.createWritable()
					.then((writer: FileSystemWritableFileStream) => {
						writer.write(JSON.stringify(groups));
						writer.close();

						setSnackbarOpen(true);
					})
					.catch(error => console.log(error));
			})
			.catch(error => console.log(error));
	};

	const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setSnackbarOpen(false);
	};

	return (
		<>
			<Wrapper>
				<Typography component='h1' variant='h4'>
					Afternoon Count
				</Typography>

				{loading &&
					<Spinner />
				}
				{!loading &&
					<>

						<Box sx={{ my: 2, display: 'flex', gap: 1 }} className='print-hide'>
							<Button variant='outlined' startIcon={<EditIcon />} onClick={handleModifyGroups}>Modify Groups</Button>
							<Button variant='outlined' startIcon={<DownloadIcon />} onClick={handleExportResults}>Export Results</Button>
						</Box>

						<Grid container spacing={2} sx={{ my: 2 }}>
							{times.map((time: Time, index: number) => {
								return (
									<Grid key={index} xs={6} md={4}>
										<AfternoonCountCard groups={groups} students={students} time={Utils.formatTime(time.timeSlot)} />
									</Grid>
								);
							})}
						</Grid>
					</>
				}
			</Wrapper>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={5000}
				onClose={handleSnackbarClose}
				message='Afternoon Count successfully saved.'
				action={
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={handleSnackbarClose}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				}
			/>
		</>
	);
};

export default AfternoonCount;
