import setup_type from './setup_type';

const prefix: string = 'Notice';
const setup: setup_type = {
    prefix,
    module_name: 'notices',

    route_prefix: 'notices',

    api_host: location.origin,
    api_prefix: 'notices',

    store_prefix: 'notices',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;
