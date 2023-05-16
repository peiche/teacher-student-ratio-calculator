import { Typography, Input, InputAdornment, Accordion, AccordionSummary } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useEffect, useState } from 'react';
import Wrapper from "../../components/Wrapper/Wrapper";
import Student from '../../interfaces/Student';
import AppwriteService from '../../services/AppwriteService';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import ROUTES from '../../constants/Routes';
import { Link, useNavigate } from 'react-router-dom';
import Group from '../../interfaces/Group';
import { v4 as uuid } from 'uuid';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import AccordionDetails from '../../components/Accordion/AccordionDetails';
import UploadIcon from '@mui/icons-material/Upload';
import { Utils } from '../../helpers/Utils';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DialogContentText from '@mui/material/DialogContentText';
import Chip from '@mui/material/Chip';
import MuiLink from "@mui/material/Link";
import { selectGroups, addGroup, removeGroup, saveGroups, saveGroupName, emptyGroups, saveStudentIds, removeGroups, emptyGroup } from '../../redux/slices/groupsSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import Alert from '@mui/material/Alert/Alert';
import Tooltip from '@mui/material/Tooltip';

const Home = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [students, setStudents] = useState<Array<Student>>([]);
	const groups = useAppSelector(selectGroups);
	const [dialogAddGroupOpen, setDialogAddGroupOpen] = useState(false);
	const [groupId, setGroupId] = useState<string>('');
	const [groupName, setGroupName] = useState<string>('');
	const [selectedStudents, setSelectedStudents] = useState<Array<string>>([]);
	const [studentFilter, setStudentFilter] = useState<string>('');
	const [dialogEmptyGroupsOpen, setDialogEmptyGroupsOpen] = useState(false);
	const [dialogRemoveGroupsOpen, setDialogRemoveGroupsOpen] = useState(false);
	const [dialogEmptyGroupOpen, setDialogEmptyGroupOpen] = useState(false);
	const [dialogRemoveGroupOpen, setDialogRemoveGroupOpen] = useState(false);
	const [group, setGroup] = useState<Group>();
	const [addGroupError, setAddGroupError] = useState(false);

	useEffect(() => {
		loadStudents();
	},
		// eslint-disable-next-line
		[]
	);

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
			});
	};

	const handleNewGroup = () => {
		setAddGroupError(false);

		setStudentFilter('');
		setGroupId('');
		setGroupName('');
		setSelectedStudents([]);

		setDialogAddGroupOpen(true);
	};

	const handleEditGroup = (editGroupId: string) => {
		setAddGroupError(false);

		const group = groups.find(group => group.id === editGroupId);
		if (group) {
			setStudentFilter('');

			setGroupId(group.id);
			setGroupName(group.name);
			if (group.studentIds) {
				setSelectedStudents([...group.studentIds]);
			} else {
				setSelectedStudents([]);
			}

			setDialogAddGroupOpen(true);
		} else {
			handleNewGroup();
		}
	};

	const handleEmptyGroup = (emptyGroupId: string) => {
		const group = groups.find((group: Group) => group.id === emptyGroupId);
		if (group) {
			dispatch(emptyGroup(group.id));
		}
		setDialogEmptyGroupOpen(false);
	};

	const handleRemoveGroup = (groupId: string) => {
		dispatch(removeGroup(groupId));
		setDialogRemoveGroupOpen(false);
	};

	const handleDialogAddGroupClose = () => {
		setDialogAddGroupOpen(false);
	};

	const handleGroupSave = () => {

		if (groupName) {
			const existingGroup = groups.find(group => group.id === groupId);
			if (existingGroup) {
				dispatch(saveGroupName({ id: existingGroup.id, name: groupName }));
				dispatch(saveStudentIds({ id: existingGroup.id, selectedStudents }));
			} else {
				const group: Group = {} as Group;
				group.id = uuid();
				group.name = groupName;
				group.studentIds = selectedStudents;
				dispatch(addGroup(group));
			}

			setDialogAddGroupOpen(false);
		} else {
			setAddGroupError(true);
		}
	};

	const handleSelectedStudent = (studentId: string) => {
		if (selectedStudents.find(id => id === studentId)) {
			const student = selectedStudents.filter((id: string) => id !== studentId);
			setSelectedStudents([...student]);
		} else {
			setSelectedStudents(selectedStudents => [...selectedStudents, studentId]);
		}
	};

	const handleGenerate = () => {
		navigate(ROUTES.AFTERNOON_COUNT);
	};

	const handleUploadFile = () => {
		const options: OpenFilePickerOptions = {
			multiple: false,
			types: Utils.filePickerTypes,
		};
		window.showOpenFilePicker(options)
			.then((handles: FileSystemFileHandle[]) => {
				if (handles.length > 0) {
					handles[0].getFile()
						.then((file: File) => {
							file.text()
								.then((content: string) => {
									try {
										const uploadedGroups = JSON.parse(content);
										dispatch(saveGroups(uploadedGroups));
										navigate(ROUTES.AFTERNOON_COUNT);
									}
									catch (error) {
										console.log(error);
									}
								})
								.catch(error => console.log(error));
						})
						.catch(error => console.log(error));
				}
			})
			.catch(error => console.log(error));
	};

	const handleStartOver = () => {
		dispatch(removeGroups());
		setDialogRemoveGroupsOpen(false);
	};

	const handleEditStudent = (studentId: string) => {
		window.open(`${ROUTES.STUDENT}/${studentId}?refer=popup`);
	};

	const handleEmptyGroups = () => {
		dispatch(emptyGroups());
		setDialogEmptyGroupsOpen(false);
	};

	const handleDialogEmptyGroupsClose = () => {
		setDialogEmptyGroupsOpen(false);
	};

	const handleDialogRemoveGroupsClose = () => {
		setDialogRemoveGroupsOpen(false);
	};

	const handleDialogEmptyGroupClose = () => {
		setDialogEmptyGroupOpen(false);
	};

	const handleDialogRemoveGroupClose = () => {
		setDialogRemoveGroupOpen(false);
	};

	return (
		<>
			<Wrapper>
				<Typography component='h1' variant='h4'>
					Select Children
				</Typography>

				<Box sx={{ my: 2, display: 'flex', gap: 1 }}>
					<Button variant='outlined' onClick={handleNewGroup} startIcon={<AddIcon />}>Add Group</Button>
					<Button variant='outlined' onClick={handleUploadFile} startIcon={<UploadIcon />}>Upload File</Button>
				</Box>

				{groups.length > 0 &&
					<>
						{groups.map((group: Group, index: number) => {
							return (
								<Accordion key={index} disableGutters variant='outlined'>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
									>{group.name}</AccordionSummary>
									<AccordionDetails>
										{group.studentIds.length > 0 &&
											<List>
												{group.studentIds.map((studentId: string, index: number) => {
													const student = students.find(student => student.id === studentId);
													return (
														<React.Fragment key={index}>
															{student &&
																<ListItem key={index} disablePadding>
																	<ListItemText
																		primary={
																			<MuiLink
																				component={Link}
																				to={`${ROUTES.STUDENT}/${student.id}`}
																				onClick={(event: any) => {
																					event.preventDefault();
																					window.open(`${ROUTES.STUDENT}/${student.id}?refer=popup`);
																				}}
																			>
																				{student.lastName}, {student.firstName}
																			</MuiLink>
																		}
																		secondary={
																			<Box component='span' sx={{
																				display: 'flex', alignItems: 'center', gap: 1,
																			}}>
																				<Box component='span'>{Utils.formatTime(student.startTime)}-{Utils.formatTime(student.endTime)}</Box>
																				<Chip component='span' label={Utils.calculateRatio(new Date(student.birthDate))} variant="outlined" size='small' />
																			</Box>
																		}
																	/>
																</ListItem>
															}
														</React.Fragment>
													);
												})}
											</List>
										}
										<Box sx={{ display: 'flex', gap: 1 }}>
											<Button
												variant='outlined'
												onClick={() => handleEditGroup(group.id)}
												startIcon={<EditIcon />}
											>Edit Group</Button>
											<Button
												variant='outlined'
												onClick={() => {
													setGroup(group);
													setDialogEmptyGroupOpen(true);
												}}
												startIcon={<RemoveCircleIcon />}
												color='error'
												disabled={group.studentIds.length === 0}
											>Empty Group</Button>
											<Button
												variant='outlined'
												onClick={() => {
													setGroup(group);
													setDialogRemoveGroupOpen(true);
												}}
												startIcon={<DeleteForeverIcon />}
												color='error'
											>Remove Group</Button>
										</Box>
									</AccordionDetails>
								</Accordion>
							);
						})}

						<Box sx={{ my: 2, display: 'flex', gap: 1, justifyContent: 'space-between' }}>
							<Button variant='contained' onClick={handleGenerate} startIcon={<FaceRetouchingNaturalIcon />}>Generate</Button>
							<Button variant='outlined' onClick={() => { setDialogEmptyGroupsOpen(true) }} startIcon={<RemoveCircleIcon />} color='error' sx={{ ml: 'auto' }}>Empty All Groups</Button>
							<Button variant='outlined' onClick={() => setDialogRemoveGroupsOpen(true)} startIcon={<DeleteForeverIcon />} color='error'>Delete All Groups</Button>
						</Box>
					</>
				}
			</Wrapper>

			<Dialog onClose={handleDialogAddGroupClose} open={dialogAddGroupOpen} fullWidth>
				<DialogTitle>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						{groupId === '' ? `New` : `Edit`} Group

						<IconButton onClick={() => setDialogAddGroupOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Box sx={{ my: 1 }}>
						{addGroupError &&
							<Alert severity='error' sx={{ mb: 2 }}>Please enter a group name.</Alert>
						}
						<FormControl fullWidth>
							<TextField InputLabelProps={{ shrink: true }} label='Name' value={groupName} onChange={event => setGroupName(event.target.value)} autoComplete='off' required autoFocus />
						</FormControl>
						<FormControl fullWidth sx={{ mt: 1 }}>
							<Input
								id='student-filter'
								value={studentFilter}
								onChange={event => setStudentFilter(event.target.value)}
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
										{studentFilter !== '' &&
											<InputAdornment position='end'>
												<IconButton onClick={() => setStudentFilter('')}>
													<CloseIcon />
												</IconButton>
											</InputAdornment>
										}
									</>
								}
							/>
						</FormControl>

						<List>
							{students.map((student: Student, index: number) => {
								return (
									<ListItem key={index} disablePadding sx={{ display: Utils.handleFilterMatch(studentFilter, student) ? 'flex' : 'none' }}>
										<ListItemButton onClick={(event: any) => handleSelectedStudent(student.id)} dense>
											<ListItemIcon>
												<Checkbox
													edge='start'
													checked={!!selectedStudents.find(id => id === student.id)}
													tabIndex={-1}
													disableRipple
												/>
											</ListItemIcon>
											<ListItemText
												primary={
													<>
														{student.lastName}, {student.firstName}
														<Chip component='span' label={Utils.calculateRatio(new Date(student.birthDate))} variant="outlined" size='small' sx={{ ml: 1 }} />
													</>
												}
											/>
										</ListItemButton>
										<Tooltip title='Edit Student'>
											<IconButton onClick={() => handleEditStudent(student.id)}>
												<EditIcon />
											</IconButton>
										</Tooltip>
									</ListItem>
								);
							})}
						</List>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogAddGroupClose}>Cancel</Button>
					<Button variant="contained" onClick={handleGroupSave}>Save</Button>
				</DialogActions>
			</Dialog>

			<Dialog onClose={handleDialogEmptyGroupsClose} open={dialogEmptyGroupsOpen} fullWidth>
				<DialogTitle>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						Empty All Groups

						<IconButton onClick={() => setDialogEmptyGroupsOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You are about to empty all groups. Are you sure?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogEmptyGroupsClose}>No</Button>
					<Button variant="contained" onClick={handleEmptyGroups} color='error'>Yes</Button>
				</DialogActions>
			</Dialog>

			<Dialog onClose={handleDialogRemoveGroupsClose} open={dialogRemoveGroupsOpen} fullWidth>
				<DialogTitle>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						Remove All Groups

						<IconButton onClick={() => setDialogRemoveGroupsOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You are about to permanently remove all groups. Are you sure?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogRemoveGroupsClose}>No</Button>
					<Button variant="contained" onClick={handleStartOver} color='error'>Yes</Button>
				</DialogActions>
			</Dialog>

			{group &&
				<>
					<Dialog onClose={handleDialogEmptyGroupClose} open={dialogEmptyGroupOpen} fullWidth>
						<DialogTitle>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								Empty Group

								<IconButton onClick={() => setDialogEmptyGroupOpen(false)}>
									<CloseIcon />
								</IconButton>
							</Box>
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								You are about to empty group {group.name}. Are you sure?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleDialogEmptyGroupClose}>No</Button>
							<Button variant="contained" onClick={() => handleEmptyGroup(group.id)} color='error'>Yes</Button>
						</DialogActions>
					</Dialog>

					<Dialog onClose={handleDialogRemoveGroupClose} open={dialogRemoveGroupOpen} fullWidth>
						<DialogTitle>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								Remove Group

								<IconButton onClick={() => setDialogRemoveGroupOpen(false)}>
									<CloseIcon />
								</IconButton>
							</Box>
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								You are about to remove group {group.name}. Are you sure?
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleDialogRemoveGroupClose}>No</Button>
							<Button variant="contained" onClick={() => handleRemoveGroup(group.id)} color='error'>Yes</Button>
						</DialogActions>
					</Dialog>
				</>
			}
		</>
	);
};

export default Home;
