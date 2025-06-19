import React from 'react';
import setup from './setup.ts';
import Layout from '../Layout.tsx';
import All from '../All.js';
import Create from '../Create.js';
import Details from '../Details.js';
import Edit from '../Edit.js';

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
            path: 'details/:id',
            element: <Details />,
        },
    ],
};
