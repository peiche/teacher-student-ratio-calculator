import { Box, Button, FormControl, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "../../components/Wrapper/Wrapper";
import AppwriteService from "../../services/AppwriteService";
import ROUTES from "../../constants/Routes";
import TextField from "../../components/TextField/TextField";
import Time from "../../interfaces/Time";

const TimeEdit = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	// eslint-disable-next-line
	const [time, setTime] = useState<Time>();
	const [timeSlot, setTimeSlot] = useState<string>();

	useEffect(() => {
		if (id && id !== 'new') {
			AppwriteService.getTime(id)
				.then(response => {
					const timeTemp: Time = {} as Time;
					timeTemp.timeSlot = response.time_slot;

					setTimeSlot(response.time_slot);

					setTime(timeTemp);
				});
		}
	}, [id]);

	const handleCancel = () => {
		handleNavigateAway();
	};

	const handleNavigateAway = () => {
		navigate(ROUTES.TIME);
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();

		if (id && id !== 'new') {
			AppwriteService.editTime(id, {
				id: id,
				timeSlot: timeSlot ?? '',
			})
				.then(doc => {
					handleNavigateAway();
				});
		} else {
			AppwriteService.createTime({
				id: '',
				timeSlot: timeSlot ?? '',
			})
				.then((studentDoc: any) => {
					handleNavigateAway();
				})
				.catch(error => console.log(error));
		}
	};

	return (
		<Wrapper>
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography component='h1' variant='h4'>
					{id === 'new' ? 'Add' : 'Edit'} Time Slot
				</Typography>
			</Box>

			<form onSubmit={handleSubmit}>
				<Box sx={{ my: 1 }}>
					<Grid container spacing={3}>
						<Grid xs={12}>
							<FormControl fullWidth>
								<TextField type='time' variant='standard' InputLabelProps={{ shrink: true }} label='Time Slot' value={timeSlot || ''} onChange={event => setTimeSlot(event.target.value)} autoComplete='off' required autoFocus />
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

export default TimeEdit;
