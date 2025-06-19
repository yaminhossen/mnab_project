import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
export interface Props {}

const Management: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const toggler = useRef(null);
    function active_row() {
        console.log(toggler);
        if (toggler && toggler.current) {
            (toggler.current as HTMLElement).classList.toggle('active');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await axios.post('/api/v1/auth/logout');
            console.log('response123', response);
            // if(response.status)
        } catch (error) {
            setError(error);
        }
    };
    const menuArray = [
        {
            group: 'User management',
            links: [
                {
                    link: '/admin#/user-staffs',
                    label: 'Employee',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/user-teachers',
                    label: 'Teacher',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/user-parents',
                    label: 'Parent',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/user-students',
                    label: 'Student',
                    icon: 'manage_accounts',
                },
            ],
        },
        {
            group: 'Todo management',
            links: [
                {
                    link: '/admin#/tasks',
                    label: 'Task',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/task-variants',
                    label: 'Variant',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/task-groups',
                    label: 'Group',
                    icon: 'manage_accounts',
                },
            ],
        },
        {
            group: 'Branch management',
            links: [
                {
                    link: '/admin#/staffs',
                    label: 'Branch',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/staffs',
                    label: 'Building',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/staffs',
                    label: 'Room',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/staffs',
                    label: 'Transport',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/staffs',
                    label: 'Driver',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/staffs',
                    label: 'Calendar',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/staffs',
                    label: 'Event Type',
                    icon: 'manage_accounts',
                },
            ],
        },
        {
            group: 'Academic management',
            links: [
                {
                    link: '/admin#/branch-classes',
                    label: 'Class',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/branch-class-sections',
                    label: 'Sections',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/branch-class-subjects',
                    label: 'Subject',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/branch-class-routine-day-times/class-routine',
                    label: 'Routines',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/branch-class-resources',
                    label: 'Resources',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/exams',
                    label: 'Exam',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/exams-routines',
                    label: 'Exam Routine',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/student-overall-evaluations',
                    label: 'Student Evaluation',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/student-evaluation-criterias',
                    label: 'Student Evaluation Criteria',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/teacher-overall-evaluations',
                    label: 'Teacher Evaluation',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/teacher-evaluation-criterias',
                    label: 'Teacher Evaluation Criteria',
                    icon: 'manage_accounts',
                },
            ],
        },
        {
            group: 'Fees management',
            links: [
                {
                    link: '/admin#/branch-class-fee-types',
                    label: 'Fee Types',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/branch-class-fees',
                    label: 'Fees',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/branch-class-fee-discounts',
                    label: 'Discount',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/branch-class-fee-waivers',
                    label: 'Waivers',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/fees-collection',
                    label: 'Fee Collection',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/staffs',
                    label: 'Due-list',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/staffs',
                    label: 'Payment History',
                    icon: 'manage_accounts',
                },
            ],
        },
        {
            group: 'Meeting management',
            links: [
                {
                    link: '/admin#/meeting',
                    label: 'Meetings',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/meeting-agendas',
                    label: 'Agendas',
                    icon: 'manage_accounts',
                },
            ],
        },
        {
            group: 'Account management',
            links: [
                {
                    link: '/admin#/accounts',
                    label: 'Account',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/account-periods',
                    label: 'Period',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/account-categories',
                    label: 'Category',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/leadger',
                    label: 'Leadger',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/journal',
                    label: 'Journal',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/debit',
                    label: 'Debit',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/credit',
                    label: 'Credit',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/profit-loss',
                    label: 'Profit&Loss',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/month-wise-statement',
                    label: 'Month wise',
                    icon: 'manage_accounts',
                },
            ],
        },
        {
            group: 'HRM management',
            links: [
                {
                    link: '/admin#/user-staffs',
                    label: 'Employee',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/user-teachers',
                    label: 'Teacher',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/attendances',
                    label: 'Attendances',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/payrolls',
                    label: 'Payroll',
                    icon: 'manage_accounts',
                },
            ],
        },
        {
            group: 'Notice management',
            links: [
                {
                    link: '/admin#/notices',
                    label: 'Notice',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/notice-categorys',
                    label: 'Category',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/faqs',
                    label: 'FAQ',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/settings',
                    label: 'Settings',
                    icon: 'manage_accounts',
                },
                // {
                //     link: '/admin#/branch-class-fees',
                //     label: 'App',
                //     icon: 'manage_accounts',
                // },
            ],
        },
    ];

    return (
        <>
            <li
                ref={toggler}
                className="icon_link_li app_drawar_link_li"
                onClick={active_row}
            >
                <a
                    href="menu"
                    onClick={(e) => e.preventDefault()}
                    className="navigation_link"
                >
                    <span className="material-symbols-outlined fill">
                        dashboard_customize
                    </span>
                </a>

                <div className="apps_list_drawer">
                    <div className="content">
                        <div className="top">
                            <div className="profile">
                                <div className="img">
                                    <img
                                        src="/assets/dashboard/images/avatar.png"
                                        alt=""
                                    />
                                </div>
                                <div className="profile_info">
                                    <h2>mr admin</h2>
                                    <h3>
                                        <span>admin</span>
                                    </h3>
                                </div>
                            </div>
                            <div className="action">
                                <ul>
                                    <li>
                                        <a href="#dashboard#">
                                            <span className="material-symbols-outlined fill">
                                                manage_accounts
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#dashboard#">
                                            <span className="material-symbols-outlined fill">
                                                settings
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            onClick={handleSubmit}
                                            to=""
                                            className="sidebar-header"
                                        >
                                            <span className="material-symbols-outlined fill">
                                                power_settings_new
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="search">
                            <input type="search" placeholder="search.." />
                        </div>
                        <div className="menu_list custom_scroll">
                            {menuArray?.map((i: { [key: string]: any }) => {
                                return (
                                    <div className="menu_apart">
                                        <h4>{i.group}</h4>
                                        <ul>
                                            {i.links?.map(
                                                (
                                                    link: {
                                                        [key: string]: any;
                                                    },
                                                    index,
                                                ) => {
                                                    return (
                                                        <li>
                                                            <a
                                                                aria-current="page"
                                                                href={link.link}
                                                                className="router-link-active router-link-exact-active"
                                                            >
                                                                <div
                                                                    className={`icon bg_color_${index + 1}`}
                                                                >
                                                                    <span className="material-symbols-outlined fill">
                                                                        {
                                                                            link.icon
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="text">
                                                                    {link.label}
                                                                </div>
                                                            </a>
                                                        </li>
                                                    );
                                                },
                                            )}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div
                    className="backdrop"
                    onClick={(e) => {
                        e.stopPropagation();
                        active_row();
                    }}
                ></div>
            </li>
        </>
    );
};

export default Management;
