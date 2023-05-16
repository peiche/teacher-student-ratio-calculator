import { useState } from 'react';
import { Tooltip, Dialog, DialogTitle, Box, DialogContent, DialogActions, IconButton, DialogContentText, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import AppwriteService from '../../services/AppwriteService';
import Time from '../../interfaces/Time';
import { Utils } from '../../helpers/Utils';

interface DeleteTimeDialogProps {
	time: Time;
	times: Array<Time>;
	setTimes: Function;
}

const DeleteTimeDialog = (props: DeleteTimeDialogProps) => {
	const { time, times, setTimes } = props;
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = () => {
		AppwriteService.removeTime(time.id).then(response => {
			setTimes([...times.filter(t => t.id !== time.id)]);
			handleClose();
		});
	};

	return (
		<>
			<Tooltip title='Remove Time'>
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
						You are about to permanently remove time slot "{Utils.formatTime(time.timeSlot)}". Are you sure?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>No</Button>
					<Button variant="contained" onClick={handleDelete} color='error'>Yes</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default DeleteTimeDialog;
