import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import commonStore from './slices/common_slice';
import users from '../views/pages/users/config/store';
import user_students_slice from '../views/pages/student/config/store';
import tasks_slice from '../views/pages/tasks/config/store';
import meeting_agendas_slice from '../views/pages/meeting_agendas/config/store';
import leave_applications_slice from '../views/pages/leave_applications/config/store';
import notices_slice from '../views/pages/notices/config/store';

const store = configureStore({
    reducer: {
        users: users.reducer,
        tasks: tasks_slice.reducer,
        user_students: user_students_slice.reducer,
        meeting_agendas: meeting_agendas_slice.reducer,
        leave_applications: leave_applications_slice.reducer,
        notices: notices_slice.reducer,
        common_store: commonStore.reducer,
    },
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export default store;
