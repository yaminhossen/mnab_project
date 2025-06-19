import setup_type from './setup_type';

const prefix: string = 'LeaveTypes';
const setup: setup_type = {
    prefix,
    module_name: 'leave_types',

    route_prefix: 'leave-types',

    api_host: location.origin,
    api_prefix: 'leave-types',

    store_prefix: 'leaveType',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;
