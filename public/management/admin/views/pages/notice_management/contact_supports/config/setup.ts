import setup_type from './setup_type';

const prefix: string = 'ContactSupports';
const setup: setup_type = {
    prefix,
    module_name: 'contact_supports',

    route_prefix: 'contact-supports',

    api_host: location.origin,
    api_prefix: 'contact-supports',

    store_prefix: 'contactSupport',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;
