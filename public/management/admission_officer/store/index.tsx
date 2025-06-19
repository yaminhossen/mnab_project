import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import commonStore from './slices/common_slice';
import users from '../views/pages/users/config/store';
import user_students from '../views/pages/students/config/store';
import student_add_new from '../views/pages/add_new/config/store';
import student_payments from '../views/pages/payment/config/store';
import meeting_agendas from '../views/pages/meeting_agendas/config/store';
import tasks from '../views/pages/tasks/config/store';
import notices from '../views/pages/notices/config/store';
import leave_applications from '../views/pages/leave_applications/config/store';

const store = configureStore({
    reducer: {
        users: users.reducer,
        user_students: user_students.reducer,
        student_add_new: student_add_new.reducer,
        student_payments: student_payments.reducer,
        common_store: commonStore.reducer,
        meeting_agendas: meeting_agendas.reducer,
        tasks: tasks.reducer,
        notices: notices.reducer,
        leave_applications: leave_applications.reducer,
    },
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export default store;
