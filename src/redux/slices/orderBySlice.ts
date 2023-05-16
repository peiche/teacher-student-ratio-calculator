import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import Student from '../../interfaces/Student';

interface OrderBy {
	value: keyof Student;
}

const initialState: OrderBy = {
	value: 'lastName',
};

export const orderBySlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		setOrderBy: (state, action: PayloadAction<keyof Student>) => {
			state.value = action.payload;
		},
	},
});

export const { setOrderBy } = orderBySlice.actions;

export const selectOrderBy = (state: RootState) => state.orderBy.value;

export default orderBySlice.reducer;
