import { styled } from '@mui/material/styles';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	background: 'rgba(0, 0, 0, 0.075)',
    borderRadius: '4px',
}));

export default AccordionDetails;
