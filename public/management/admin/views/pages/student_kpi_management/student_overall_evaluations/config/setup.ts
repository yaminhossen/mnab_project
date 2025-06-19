import setup_type from './setup_type';

const prefix: string = 'StudentOverallEvaluations';
const setup: setup_type = {
    prefix,
    module_name: 'student_overall_evaluations',

    route_prefix: 'student-overall-evaluations',

    api_host: location.origin,
    api_prefix: 'student-overall-evaluations',

    store_prefix: 'studentOverallEvaluation',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;
