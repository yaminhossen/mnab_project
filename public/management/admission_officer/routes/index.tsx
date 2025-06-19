import { NonIndexRouteObject } from 'react-router-dom';
import DashboardLayout from '../views/layouts/DashboardLayout';
import T1 from '../views/pages/T1';
import user_branch_staff_routes from '../views/pages/users/config/routes';
import React from 'react';
import add_new_routes from '../views/pages/add_new/config/routes';
import students_routes from '../views/pages/students/config/routes';
import students_payments from '../views/pages/payment/config/routes';
import notices_routes from '../views/pages/notices/config/routes';
import settings_routes from '../views/pages/settings/config/routes';
import tasks_routes from '../views/pages/tasks/config/routes';
import meeting_agendas_routes from '../views/pages/meeting_agendas/config/routes';
import leave_applications from '../views/pages/leave_applications/config/routes';

interface RouteTypes extends NonIndexRouteObject {}
const router: RouteTypes[] = [
    {
        path: '/',
        element: <DashboardLayout />,
        children: [
            add_new_routes,
            students_routes,
            students_payments,
            notices_routes,
            settings_routes,
            tasks_routes,
            leave_applications,
            meeting_agendas_routes,
            {
                path: '',
                element: <T1 />,
            },
            user_branch_staff_routes,
        ],
    },
];

export default router;
