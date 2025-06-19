import React from 'react';
import Layout from './Layout';
import Index from '../Index';
import Markshit from '../Markshit';
import TermResult from '../TermResult';

// export { default as DashboardCounterAll} from "./All.jsx";

export default {
    path: 'mark-sheet',
    element: <Layout />,
    children: [
        {
            path: '',
            index: true,
            element: <Index />,
        },
        {
            path: 'details/:id',
            element: <Markshit />,
        },
        {
            path: 'term-exam/:termid/:classid',
            element: <TermResult />,
        },
    ],
};
