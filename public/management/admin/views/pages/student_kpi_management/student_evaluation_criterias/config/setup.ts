import setup_type from './setup_type';

const prefix: string = 'StudentEvaluationCriterias';
const setup: setup_type = {
    prefix,
    module_name: 'student_evaluation_criterias',

    route_prefix: 'student-evaluation-criterias',

    api_host: location.origin,
    api_prefix: 'student-evaluation-criterias',

    store_prefix: 'studentEvaluationCriteria',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;
