import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import { Utils } from "../../helpers/Utils";
import Group from "../../interfaces/Group";
import Student from "../../interfaces/Student";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import AccordionDetails from "../Accordion/AccordionDetails";
import Chip from "@mui/material/Chip";
import ROUTES from "../../constants/Routes";
import MuiLink from "@mui/material/Link";
import { Link } from "react-router-dom";
import { Divider } from "@mui/material";

interface AfternoonCountCardProps {
	groups: Array<Group>;
	students: Array<Student>;
	time: string;
}

const AfternoonCountCard = (props: AfternoonCountCardProps) => {
	const { groups, students, time } = props;

	let total = 0;

	return (
		<Card variant="outlined">
			<CardContent>
				<Typography component='h2' variant='h5'>{time}</Typography>

				{groups.map((group: Group, index: number) => {
					const filteredStudents = students.filter(student => group.studentIds.includes(student.id));
					const studentNumber = Utils.calculateStudentRatios(filteredStudents, time);
					total = total + parseFloat(studentNumber);

					return (
						<Accordion key={index} disableGutters elevation={0}>
							<AccordionSummary sx={{ p: 0 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, width: '100%' }}>
									{group.name}
									<Chip label={studentNumber} variant='outlined' />
								</Box>
							</AccordionSummary>
							<AccordionDetails sx={{ p: 0 }}>
								<List disablePadding sx={{ px: 1 }}>
									{filteredStudents
									.map((student: Student, index: number) => {
										return (
											<ListItem key={index} disablePadding disableGutters>
												<ListItemText
													primary={
														<MuiLink
															component={Link}
															to={`${ROUTES.STUDENT}/${student.id}`}
															onClick={(event: any) => {
																event.preventDefault();
																window.open(`${ROUTES.STUDENT}/${student.id}?refer=popup`);
															}}
														>{student.lastName}, {student.firstName}</MuiLink>
													}
													secondary={
														<Box component='span' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
															<Box component='span' sx={{
																color: Utils.isTimeCounted(student, time) ? 'inherit' : '#d32f2f',
																textDecoration: Utils.isTimeCounted(student, time) ? 'inherit' : 'line-through',
															}}>{Utils.formatTime(student.startTime)}-{Utils.formatTime(student.endTime)}</Box>
															<Chip component='span' label={Utils.calculateRatio(new Date(student.birthDate))} variant="outlined" size='small' />
														</Box>
													}
												/>
											</ListItem>
										);
									})}
								</List>
							</AccordionDetails>
						</Accordion>
					);
				})}

				<Divider sx={{ borderWidth: 1 }} />
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, width: '100%' }}>
					<Typography sx={{ fontWeight: 700 }}>Total</Typography>
					<Chip component='span' label={total.toFixed(2)} sx={{ fontWeight: 700 }} />
				</Box>
			</CardContent>
		</Card>
	);
};

export default AfternoonCountCard;
