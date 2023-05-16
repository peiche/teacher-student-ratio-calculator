import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Group from '../../interfaces/Group';
import type { RootState } from '../store';

interface GroupsState {
	value: Array<Group>;
}

const initialState: GroupsState = {
	value: [],
};

export const groupsSlice = createSlice({
	name: 'groups',
	initialState,
	reducers: {
		addGroup: (state, action: PayloadAction<Group>) => {
			state.value = [...state.value, action.payload];
		},
		emptyGroup: (state, action: PayloadAction<string>) => {
			state.value.forEach((group: Group) => {
				if (group.id === action.payload) {
					group.studentIds = [];
				}
			});
		},
		removeGroup: (state, action: PayloadAction<string>) => {
			state.value = state.value.filter(v => v.id !== action.payload);
		},
		saveGroups: (state, action: PayloadAction<Array<Group>>) => {
			state.value = action.payload;
		},
		saveGroupName: (state, action: PayloadAction<any>) => {
			state.value.forEach((group: Group) => {
				if (group.id === action.payload.id) {
					group.name = action.payload.name;
				}
			});
		},
		saveStudentIds: (state, action: PayloadAction<any>) => {
			state.value.forEach((group: Group) => {
				if (group.id === action.payload.id) {
					group.studentIds = action.payload.selectedStudents;
				}
			});
		},
		emptyGroups: (state) => {
			state.value.forEach((group: Group) => {
				group.studentIds = [];
			});
		},
		removeGroups: (state) => {
			state.value = [];
		},
	},
});

export const {
	addGroup,
	emptyGroup,
	removeGroup,
	saveGroups,
	saveGroupName,
	emptyGroups,
	removeGroups,
	saveStudentIds,
} = groupsSlice.actions;

export const selectGroups = (state: RootState) => state.groups.value;

export default groupsSlice.reducer;
