import { useState } from 'react';
import { Tooltip, Dialog, DialogTitle, Box, DialogContent, DialogActions, IconButton, DialogContentText, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import Student from '../../interfaces/Student';
import AppwriteService from '../../services/AppwriteService';

interface DeleteStudentDialogProps {
	student: Student;
	students: Array<Student>;
	setStudents: Function;
}

const DeleteStudentDialog = (props: DeleteStudentDialogProps) => {
	const { student, students, setStudents } = props;
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = () => {
		AppwriteService.removeStudent(student.id).then(response => {
			setStudents([...students.filter(s => s.id !== student.id)]);
			handleClose();
		});
	};

	return (
		<>
			<Tooltip title='Remove Student'>
				<IconButton onClick={handleOpen}>
					<DeleteForeverIcon />
				</IconButton>
			</Tooltip>
			<Dialog onClose={handleClose} open={open} fullWidth>
				<DialogTitle>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						Remove Student

						<IconButton onClick={handleClose}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You are about to permanently remove {student.firstName} {student.lastName}. Are you sure?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>No</Button>
					<Button variant="contained" onClick={handleDelete} color='error'>Yes</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default DeleteStudentDialog;
