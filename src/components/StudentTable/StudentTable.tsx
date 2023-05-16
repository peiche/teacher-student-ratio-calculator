import * as React from 'react';
import { useState } from 'react';
import Student from "../../interfaces/Student";
import { TableContainer, Table, TableRow, TableCell, TableBody, Paper, IconButton, TablePagination, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import StudentTableHead from "../StudentTableHead/StudentTableHead";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { Utils } from '../../helpers/Utils';
import Tooltip from '@mui/material/Tooltip';
import Order from '../../interfaces/Order';
import DeleteStudentDialog from '../DeleteStudentDialog/DeleteStudentDialog';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../constants/Routes';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectRowsPerPage, setRowsPerPage } from '../../redux/slices/rowsPerPageSlice';
import { selectOrder, setOrder } from '../../redux/slices/orderSlice';
import { selectOrderBy, setOrderBy } from '../../redux/slices/orderBySlice';

interface StudentTableProps {
	students: Array<Student>;
	setStudents: Function;
}

const StudentTable = (props: StudentTableProps) => {
	const { students, setStudents } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [page, setPage] = useState(0);
	const order = useAppSelector(selectOrder);
	const orderBy = useAppSelector(selectOrderBy);
	const rowsPerPage = useAppSelector(selectRowsPerPage);

	const [filter, setFilter] = useState<string>('');

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof Student,
	) => {
		const isAsc = orderBy === property && order === 'asc';
		dispatch(setOrder(isAsc ? 'desc' : 'asc'));
		dispatch(setOrderBy(property));
	};

	function getComparator<Key extends keyof Student>(
		order: Order,
		orderBy: Key,
	): (
		a: { [key in Key]: number | string },
		b: { [key in Key]: number | string },
	) => number {
		return order === 'desc'
			? (a, b) => Utils.descendingComparator(a, b, orderBy)
			: (a, b) => -Utils.descendingComparator(a, b, orderBy);
	}

	const handleEditStudent = (studentId: string) => {
		navigate(`${ROUTES.STUDENT}/${studentId}`);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
		setPage(0);
	};

	const filteredStudents = students
		.filter((student: Student, index: number) => {
			return Utils.handleFilterMatch(filter, student);
		})
		.sort(getComparator(order, orderBy));

	const filteredStudentsPage = filteredStudents.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage,
	);

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<FormControl fullWidth sx={{ mt: 1 }}>
					<Input
						id='student-filter'
						value={filter}
						onChange={event => setFilter(event.target.value)}
						autoComplete='off'
						placeholder='Type to filter students by first or last name'
						sx={{ py: 1 }}
						startAdornment={
							<InputAdornment position='start'>
								<FilterListIcon />
							</InputAdornment>
						}
						endAdornment={
							<>
								{filter !== '' &&
									<InputAdornment position='end'>
										<IconButton onClick={() => setFilter('')}>
											<CloseIcon />
										</IconButton>
									</InputAdornment>
								}
							</>
						}
					/>
				</FormControl>
			</Box>
			<TableContainer component={Paper} variant='outlined' sx={{ mt: 2 }}>
				<Table>
					<StudentTableHead
						order={order}
						orderBy={orderBy}
						onRequestSort={handleRequestSort}
					/>
					<TableBody>
						{filteredStudentsPage
							.map((student: Student, index: number) => {
								return (
									<TableRow key={index}>
										<TableCell>{student.lastName}</TableCell>
										<TableCell>{student.firstName}</TableCell>
										<TableCell>{Utils.formatTime(student.startTime)}</TableCell>
										<TableCell>{Utils.formatTime(student.endTime)}</TableCell>
										<TableCell>{Utils.formatDate(student.birthDate)}</TableCell>
										<TableCell>
											<Chip component='span' label={Utils.calculateRatio(new Date(student.birthDate))} variant="outlined" size='small' />
										</TableCell>
										<TableCell align='right'>
											<Tooltip title='Edit Student'>
												<IconButton onClick={() => handleEditStudent(student.id)}>
													<EditIcon />
												</IconButton>
											</Tooltip>

											<DeleteStudentDialog student={student} students={students} setStudents={setStudents} />
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component='div'
				count={filteredStudents.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</>
	);
};

export default StudentTable;
