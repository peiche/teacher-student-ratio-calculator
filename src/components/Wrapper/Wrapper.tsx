import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MuiListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation } from 'react-router-dom';
import ROUTES from '../../constants/Routes';
import { Container, Tooltip } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../../themes/Theme';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const drawerWidth = 240;

interface Props {
	window?: () => Window;
	children: React.ReactNode;
	hideSidebar?: boolean;
}

interface ListItemProps {
	route: string;
	icon: React.ReactNode;
	label: string;
}

const Wrapper = (props: Props) => {
	const theme = useTheme();
	const colorMode = React.useContext(ColorModeContext);
	const location = useLocation();
	const { window, children, hideSidebar } = props;
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const ListItemLink = (props: ListItemProps) => {
		const { route, icon, label } = props;

		return (
			<MuiListItem disablePadding component={Link} to={route} sx={{ color: 'inherit' }}>
				<ListItemButton selected={location.pathname === route}>
					<ListItemIcon>
						{icon}
					</ListItemIcon>
					<ListItemText primary={label} />
				</ListItemButton>
			</MuiListItem>
		);
	};

	const container = window !== undefined ? () => window().document.body : undefined;

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<List>
				<ListItemLink route={ROUTES.HOME} icon={<HomeIcon />} label='Select Children' />
				<ListItemLink route={ROUTES.STUDENT} icon={<FaceIcon />} label='Students' />
				<ListItemLink route={ROUTES.TIME} icon={<AccessTimeIcon />} label='Time Slots' />
			</List>
		</div>
	);

	return (
		<Box sx={{ display: 'flex' }}>
			{!hideSidebar &&
				<>
					<AppBar
						position="fixed"
						sx={{
							width: { sm: `calc(100% - ${drawerWidth}px)` },
							ml: { sm: `${drawerWidth}px` },
						}}
						className='print-hide'
					>
						<Toolbar>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								edge="start"
								onClick={handleDrawerToggle}
								sx={{ mr: 2, display: { sm: 'none' } }}
							>
								<MenuIcon />
							</IconButton>
							<Typography variant="h6" noWrap component="div">
								Teacher-Student Ratio Calculator
							</Typography>

							<Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
								<Tooltip title='Toggle Color Mode'>
									<IconButton color='inherit' onClick={colorMode.toggleColorMode}>
										{theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
									</IconButton>
								</Tooltip>
							</Box>
						</Toolbar>
					</AppBar>
					<Box
						component="nav"
						sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
						aria-label="mailbox folders"
					>
						{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
						<Drawer
							container={container}
							variant="temporary"
							open={mobileOpen}
							onClose={handleDrawerToggle}
							ModalProps={{
								keepMounted: true, // Better open performance on mobile.
							}}
							sx={{
								display: { xs: 'block', sm: 'none' },
								'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
							}}
						>
							{drawer}
						</Drawer>
						<Drawer
							variant="permanent"
							sx={{
								display: { xs: 'none', sm: 'block' },
								'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
							}}
							open
						>
							{drawer}
						</Drawer>
					</Box>
				</>
			}
			<Box
				component="main"
				sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
			>
				<Toolbar />
				<Container>
					{children}
				</Container>
			</Box>
		</Box>
	);
};

export default Wrapper;
