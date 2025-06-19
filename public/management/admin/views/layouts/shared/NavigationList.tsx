import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { anyObject } from '../../../common_types/object';

export interface Props {}

const NavigationList: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<any>();
    const [isActive, setIsActive] = useState(false); // Track drawer state
    const toggler = useRef<HTMLLIElement>(null);

    // Toggle drawer manually
    const active_row = () => {
        setIsActive((prev) => !prev);
    };

    // Detect outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isActive &&
                toggler.current &&
                !toggler.current.contains(event.target as Node)
            ) {
                setIsActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isActive]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let confirm = await (window as anyObject).s_confirm('Logout');
            if (confirm) {
                await axios.post('/api/v1/auth/logout');
            }
        } catch (error) {
            setError(error);
        }
    };
    const fetchData = async () => {
        try {
            const response = await axios.get(
                '/api/v1/admin-users/admin-details',
            );
            setData(response.data.data);
        } catch (error) {
            setError(error);
        }
    };

    // useEffect(() => {
    //     fetchData();
    // }, []);
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchData();
        }, 1000);

        return () => clearTimeout(timeout); // Clean up on unmount
    }, []);
    const menuArray = [
        {
            group: 'User management',
            links: [
                {
                    link: '/admin#/user-teachers',
                    label: 'Teacher',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/user-parents',
                    label: 'Admin',
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
                    link: '/admin#/academic-calendars',
                    label: 'Calendar',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/academic-calendar-event-types',
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
                    link: '/admin#/user-students',
                    label: 'Due-list',
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
                {
                    link: '/admin#/leave-applications',
                    label: 'Leave application',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/leave-types',
                    label: 'Leave types',
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
                    label: 'Notice Category',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/faqs',
                    label: 'FAQs',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/policies',
                    label: 'Policies',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/contact-supports',
                    label: 'Contact support',
                    icon: 'manage_accounts',
                },
                {
                    link: '/admin#/settings',
                    label: 'Settings',
                    icon: 'manage_accounts',
                },
            ],
        },
    ];

    return (
        <>
            <li
                ref={toggler}
                className={`icon_link_li app_drawar_link_li ${isActive ? 'active' : ''}`}
                onClick={active_row}
            >
                <a
                    href="menu"
                    onClick={(e) => e.preventDefault()}
                    className="navigation_link"
                >
                    <span className="material-symbols-outlined fill">apps</span>
                </a>

                <div className="apps_list_drawer">
                    <div
                        className="content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="top">
                            <div className="profile">
                                <div className="img">
                                    <img
                                        src={
                                            data?.image ||
                                            '/assets/dashboard/images/avatar.png'
                                        }
                                        alt=""
                                    />
                                </div>
                                <div className="profile_info">
                                    <h2>{data?.name}</h2>
                                    <h3>
                                        <span>admin</span>
                                    </h3>
                                </div>
                            </div>
                            <div className="action">
                                <ul>
                                    <li onClick={() => setIsActive(false)}>
                                        <a href="/admin#/settings">
                                            <span className="material-symbols-outlined fill">
                                                manage_accounts
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
                            {/* <input type="search" placeholder="search.." /> */}
                        </div>
                        <div className="menu_list custom_scroll">
                            {menuArray?.map((i) => (
                                <div className="menu_apart" key={i.group}>
                                    <h4>{i.group}</h4>
                                    <ul>
                                        {i.links?.map((link, index) => (
                                            <li
                                                key={link.link}
                                                onClick={() =>
                                                    setIsActive(false)
                                                } // <-- Close drawer on click
                                            >
                                                <a
                                                    aria-current="page"
                                                    href={link.link}
                                                    className="router-link-active router-link-exact-active"
                                                >
                                                    <div
                                                        className={`icon bg_color_${index + 1}`}
                                                    >
                                                        <span className="material-symbols-outlined fill">
                                                            {link.icon}
                                                        </span>
                                                    </div>
                                                    <div className="text">
                                                        {link.label}
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {isActive && (
                    <div
                        className="backdrop"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsActive(false);
                        }}
                    ></div>
                )}
            </li>
        </>
    );
};

export default NavigationList;
