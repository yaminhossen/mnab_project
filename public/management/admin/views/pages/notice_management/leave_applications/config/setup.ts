import setup_type from './setup_type';

const prefix: string = 'LeaveApplications';
const setup: setup_type = {
    prefix,
    module_name: 'leave_applications',

    route_prefix: 'leave-applications',

    api_host: location.origin,
    api_prefix: 'leave-applications',

    store_prefix: 'leaveApplication',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;
