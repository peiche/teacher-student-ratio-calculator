import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import _Order from '../../interfaces/Order';

interface Order {
	value: _Order;
}

const initialState: Order = {
	value: 'desc',
};

export const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		setOrder: (state, action: PayloadAction<_Order>) => {
			state.value = action.payload;
		},
	},
});

export const { setOrder } = orderSlice.actions;

export const selectOrder = (state: RootState) => state.order.value;

export default orderSlice.reducer;
