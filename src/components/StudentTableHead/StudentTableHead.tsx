import { Box, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import Student from "../../interfaces/Student";
import TableHeadCell from "../TableHeadCell/TableHeadCell";

type Order = 'asc' | 'desc';

interface StudentTableHeadProps {
	order: Order;
	orderBy: string;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Student) => void;
}

interface HeadCell {
	id: keyof Student;
	label: string;
}

const StudentTableHead = (props: StudentTableHeadProps) => {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler =
		(property: keyof Student) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	const headCells: readonly HeadCell[] = [
		{
			id: 'lastName',
			label: 'Last Name',
		},
		{
			id: 'firstName',
			label: 'First Name',
		},
		{
			id: 'startTime',
			label: 'Start Time',
		},
		{
			id: 'endTime',
			label: 'End Time',
		},
		{
			id: 'birthDate',
			label: 'Birth Date',
		},
	];

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell: HeadCell, index: number) => {
					return (
						<TableHeadCell
							key={index}
							sortDirection={orderBy === headCell.id ? order : false}
						>
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : 'asc'}
								onClick={createSortHandler(headCell.id)}
							>
								{headCell.label}
								{orderBy === headCell.id ? (
									<Box component='span' sx={visuallyHidden}>
										{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
									</Box>
								) : null}
							</TableSortLabel>
						</TableHeadCell>
					);
				})}

				<TableHeadCell>Ratio</TableHeadCell>
				<TableHeadCell></TableHeadCell>
			</TableRow>
		</TableHead>
	);
};

export default StudentTableHead;
