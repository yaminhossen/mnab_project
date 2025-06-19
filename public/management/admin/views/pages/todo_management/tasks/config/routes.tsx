import React from 'react';
import setup from './setup.ts';
import Layout from '../Layout.tsx';
import All from '../All.jsx';
import Create from '../Create.jsx';
import Details from '../Details.jsx';
import Edit from '../Edit.jsx';
import TaskAssign from '../TaskAssign.tsx';
import TaskDetails from '../TaskDetails.tsx';

// export { default as DashboardCounterAll} from "./All.jsx";

export default {
    path: setup.route_prefix,
    element: <Layout />,
    children: [
        {
            path: '',
            element: <All />,
        },
        {
            path: 'create',
            element: <Create />,
        },
        {
            path: 'edit/:id',
            element: <Edit />,
        },
        {
            path: 'assign/:id',
            element: <TaskAssign />,
        },
        {
            path: 'details/:id',
            element: <Details />,
        },
        {
            path: 'task-details/:id',
            element: <TaskDetails />,
        },
    ],
};
