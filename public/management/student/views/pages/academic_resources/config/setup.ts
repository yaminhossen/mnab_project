import setup_type from './setup_type';

const prefix: string = 'Academic resources';
const setup: setup_type = {
    prefix,
    module_name: 'academic_resources',

    route_prefix: 'academic-resources',

    api_host: location.origin,
    api_prefix: 'academic-resources',

    store_prefix: 'academicResource',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;
