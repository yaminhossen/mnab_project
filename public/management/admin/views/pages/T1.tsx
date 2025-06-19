import React from 'react';
import { Link } from 'react-router-dom';
export interface Props {}

const T1: React.FC<Props> = (props: Props) => {
    return (
        <div className="admin_dashboard">
            <h1>মাদরাসাতুন নূর আল আরাবিয়া</h1>
            <h2>Admin Dashboard</h2>
            <div className="menu_list custom_scroll">
                <h3 className="mt-4 ms-0">User management</h3>
                <ul className="dashboard_links ">
                    <li>
                        <Link to="/user-teachers">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Teachers Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/user-admins">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Admin Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/user-students">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Students Management
                        </Link>
                    </li>
                </ul>

                <h3 className="mt-4 ms-0">Todo management</h3>
                <ul className="dashboard_links ">
                    <li>
                        <Link to="/tasks">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Tasks Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/academic-calendars">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Academic Calendars Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/academic-calendar-event-types">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Academic Calendar Event Type Management
                        </Link>
                    </li>
                </ul>

                <h3 className="mt-4 ms-0">Academic management</h3>
                <ul className="dashboard_links ">
                    <li>
                        <Link to="/branch-classes">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Classes
                        </Link>
                    </li>
                    <li>
                        <Link to="/branch-class-sections">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Class Section
                        </Link>
                    </li>
                    <li>
                        <Link to="/branch-class-subjects">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Class Subjects
                        </Link>
                    </li>
                    <li>
                        <Link to="/branch-class-routine-day-times/class-routine">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Class Routine At A Glanc
                        </Link>
                    </li>
                    <li>
                        <Link to="/branch-class-resources">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Class Resources
                        </Link>
                    </li>
                    <li>
                        <Link to="/exams">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Exam Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/exam-routines">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Exam Routine Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/student-overall-evaluations">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Student Overall Evaluation
                        </Link>
                    </li>
                    <li>
                        <Link to="/student-evaluation-criterias">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Student Evaluation Criteria
                        </Link>
                    </li>
                    {/* <li>
                        <Link to="/teacher-overall-evaluations">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Teacher Overall Evaluation
                        </Link>
                    </li>
                    <li>
                        <Link to="/teacher-evaluation-criterias">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Teacher Evaluation Criteria
                        </Link>
                    </li> */}
                </ul>

                <h3 className="mt-4 ms-0">Fees management</h3>
                <ul className="dashboard_links ">
                    <li>
                        <Link to="/branch-class-fee-types">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Class Fee types
                        </Link>
                    </li>
                    <li>
                        <Link to="/branch-class-fees">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Class Fees
                        </Link>
                    </li>
                    {/* <li>
                        <Link to="/branch-class-fee-discounts">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Class Fee Discounts
                        </Link>
                    </li>
                    <li>
                        <Link to="/branch-class-fee-waivers">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Class Fee Waivers
                        </Link>
                    </li> */}
                    {/* <li>
                        <Link to="/fees-collection">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Fees Collections
                        </Link>
                    </li> */}
                    <li>
                        <Link to="/user-students">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Due List
                        </Link>
                    </li>
                    {/* <li>
                        <Link to="/branch-class-fee-types">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Payment History
                        </Link>
                    </li> */}
                </ul>

                <h3 className="mt-4 ms-0">Meeting management</h3>
                <ul className="dashboard_links ">
                    <li>
                        <Link to="/meeting">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Meetings Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/meeting-agendas">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Meeting Agendas Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/leave-applications">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Leave Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/leave-types">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Leave Type Management
                        </Link>
                    </li>
                </ul>

                <h3 className="mt-4 ms-0">Notice management</h3>
                <ul className="dashboard_links ">
                    <li>
                        <Link to="/notices">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Notice Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/notice-categorys">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Notice Category Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/faqs">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            FAQ Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/policies">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Policy Management
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact-supports">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Contact Support
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            Settings Management
                        </Link>
                    </li>
                    {/* <li>
                        <Link to="/app-settings">
                            <span className="material-symbols-outlined fill">
                                groups
                            </span>
                            App Management
                        </Link>
                    </li> */}
                </ul>
            </div>
        </div>
    );
};

export default T1;
