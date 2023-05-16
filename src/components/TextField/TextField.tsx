import { styled } from '@mui/material/styles';
import MuiTextField from "@mui/material/TextField/TextField";

const TextField = styled(MuiTextField)({
	'input::-webkit-calendar-picker-indicator': {
		display: 'none',
	},
});

export default TextField;
