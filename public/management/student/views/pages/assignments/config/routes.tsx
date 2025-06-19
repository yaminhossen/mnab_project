import React from 'react';
import Layout from './Layout';
import Index from '../Index';
import Details from '../Details';
import Review from '../pages/Review';
import SubjectDetails from '../pages/SubjectDetails';
import Create from '../pages/Create';

// export { default as DashboardCounterAll} from "./All.jsx";

export default {
    path: 'assignments',
    element: <Layout />,
    children: [
        {
            path: '',
            index: true,
            element: <Details />,
        },
        {
            path: 'class-details/:id',
            element: <Details />,
        },
        {
            path: 'subject/:id',
            element: <SubjectDetails />,
        },
        {
            path: 'create/:id',
            element: <Create />,
        },
    ],
};
