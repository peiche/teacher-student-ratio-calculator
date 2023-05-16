import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store';

interface ColorMode {
	value: string;
}

const initialState: ColorMode = {
	value: 'light',
};

export const colorModeSlice = createSlice({
	name: 'colorMode',
	initialState,
	reducers: {
		setColorMode: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
		},
	},
});

export const { setColorMode } = colorModeSlice.actions;

export const selectColorMode = (state: RootState) => state.colorMode.value;

export default colorModeSlice.reducer;
