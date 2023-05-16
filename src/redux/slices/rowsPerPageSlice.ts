import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface RowsPerPage {
	value: number;
}

const initialState: RowsPerPage = {
	value: 5,
};

export const rowsPerPageSlice = createSlice({
	name: 'rowsPerPage',
	initialState,
	reducers: {
		setRowsPerPage: (state, action: PayloadAction<number>) => {
			state.value = action.payload;
		},
	},
});

export const { setRowsPerPage } = rowsPerPageSlice.actions;

export const selectRowsPerPage = (state: RootState) => state.rowsPerPage.value;

export default rowsPerPageSlice.reducer;
