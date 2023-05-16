import * as React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Wrapper from "../../components/Wrapper/Wrapper";
import AppwriteService from '../../services/AppwriteService';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Spinner from '../../components/Spinner/Spinner';
import Time from '../../interfaces/Time';
import ROUTES from '../../constants/Routes';
import { Link, useNavigate } from 'react-router-dom';
import { Paper, TableContainer, Table, TableBody, TableRow, TableCell, Tooltip, IconButton, TableHead, Link as MuiLink } from '@mui/material';
import { Utils } from '../../helpers/Utils';
import EditIcon from '@mui/icons-material/Edit';
import Order from '../../interfaces/Order';
import TableHeadCell from '../../components/TableHeadCell/TableHeadCell';
import DeleteTimeDialog from '../../components/DeleteTimeDialog/DeleteTimeDialog';

const TimeList = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [times, setTimes] = useState<Array<Time>>([]);
	const order = 'asc';
	const orderBy = 'timeSlot';

	useEffect(() => {
		AppwriteService.getTimesList()
			.then(response => {
				response.documents.forEach(doc => {
					const time: Time = {} as Time;
					time.id = doc.$id;
					time.timeSlot = doc.time_slot;

					setTimes(times => [...times, time]);
				});

				setLoading(false);
			});
	}, []);

	const handleNewTime = () => {
		navigate(`${ROUTES.TIME}/new`);
	};

	function getComparator<Key extends keyof Time>(
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

	const handleEditTime = (timeId: string) => {
		navigate(`${ROUTES.TIME}/${timeId}`);
	};

	return (
		<>
			<Wrapper>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography component='h1' variant='h4'>
						Time Slots
					</Typography>

					<Button variant="contained" onClick={handleNewTime} startIcon={<AddIcon />}>New Time</Button>
				</Box>

				{loading &&
					<Spinner />
				}
				{!loading &&
					<>
						{times.length > 0 &&
							<>
								<TableContainer component={Paper} variant='outlined' sx={{ mt: 2 }}>
									<Table>
										<TableHead>
											<TableRow>
												<TableHeadCell>Time</TableHeadCell>
												<TableHeadCell></TableHeadCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{times
												.sort(getComparator(order, orderBy))
												.map((time: Time, index: number) => {
													return (
														<React.Fragment key={index}>
															{time &&
																<TableRow>
																	<TableCell>{Utils.formatTime(time.timeSlot)}</TableCell>
																	<TableCell sx={{ textAlign: 'right' }}>
																		<Tooltip title='Edit Time'>
																			<IconButton onClick={() => handleEditTime(time.id)}>
																				<EditIcon />
																			</IconButton>
																		</Tooltip>

																		<DeleteTimeDialog time={time} times={times} setTimes={setTimes} />
																	</TableCell>
																</TableRow>
															}
														</React.Fragment>
													);
												})}
										</TableBody>
									</Table>
								</TableContainer>
							</>
						}
						{times.length === 0 &&
							<Typography sx={{ mt: 2 }}>There are no time slots. <MuiLink component={Link} to={`${ROUTES.TIME}/new`}>Create one now.</MuiLink></Typography>
						}
					</>
				}
			</Wrapper>
		</>
	);
};

export default TimeList;
