import * as React from 'react';
import { useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ROUTES from '../../constants/Routes';
import Home from '../../pages/Home/Home';
import StudentList from '../../pages/Student/StudentList';
import AfternoonCount from '../../pages/AfternoonCount/AfternoonCount';
import { Box } from '@mui/material';
import StudentEdit from '../../pages/Student/StudentEdit';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeContext } from '../../themes/Theme';
import { selectColorMode, setColorMode } from '../../redux/slices/colorModeSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import TimeList from '../../pages/Time/TimeList';
import TimeEdit from '../../pages/Time/TimeEdit';

const LayoutView: React.FC = () => {
	const dispatch = useAppDispatch();
	const persistedColorMode = useAppSelector(selectColorMode);
	const [mode, setMode] = React.useState<'light' | 'dark'>(persistedColorMode === 'light' ? 'light' : 'dark');
	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
				dispatch(setColorMode(mode));
			},
		}),
		// eslint-disable-next-line
		[],
	);

	const Theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode],
	);

	useEffect(() => {
		dispatch(setColorMode(mode));
	},
		// eslint-disable-next-line
		[mode]
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={Theme}>
				<CssBaseline />
				<BrowserRouter>
					<Box component='main'>
						<Routes>
							<Route path={ROUTES.HOME} element={<Home />} />
							<Route path={ROUTES.AFTERNOON_COUNT} element={<AfternoonCount />} />
							<Route path={ROUTES.STUDENT} element={<StudentList />} />
							<Route path={`${ROUTES.STUDENT}/:id`} element={<StudentEdit />} />
							<Route path={ROUTES.TIME} element={<TimeList />} />
							<Route path={`${ROUTES.TIME}/:id`} element={<TimeEdit />} />
						</Routes>
					</Box>
				</BrowserRouter>
			</ThemeProvider>
		</ColorModeContext.Provider>
	)
};

export default LayoutView;
