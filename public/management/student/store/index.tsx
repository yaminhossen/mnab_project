import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import commonStore from './slices/common_slice';
import users from '../views/pages/users/config/store';
import notices from '../views/pages/notices/config/store';
import leave_applications from '../views/pages/leave_applications/config/store';
import academic_resources from '../views/pages/academic_resources/config/store';

const store = configureStore({
    reducer: {
        users: users.reducer,
        notices: notices.reducer,
        academic_resources: academic_resources.reducer,
        leave_applications: leave_applications.reducer,
        common_store: commonStore.reducer,
    },
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export default store;
