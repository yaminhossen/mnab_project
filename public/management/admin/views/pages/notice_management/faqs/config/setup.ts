import setup_type from './setup_type';

const prefix: string = 'Faqs';
const setup: setup_type = {
    prefix,
    module_name: 'faqs',

    route_prefix: 'faqs',

    api_host: location.origin,
    api_prefix: 'faqs',

    store_prefix: 'faq',
    layout_title: prefix + ' Management',

    all_page_title: 'All ' + prefix,
    details_page_title: 'Details ' + prefix,
    create_page_title: 'Create ' + prefix,
    edit_page_title: 'Edit ' + prefix,
};

export default setup;
