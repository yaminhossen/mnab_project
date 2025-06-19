import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from './pages/BackButton';
export interface Props {}

const SingleStudent: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<any>([]);
    const { id } = useParams();
    // console.log('user student id', id);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/api/v1/user-students/basic-information`,
            );
            setData(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // console.log('newdata from single', data);

    return (
        <div className="admin_dashboard">
            <BackButton></BackButton>
            <div className="admin_dashboard">
                <div className="single-info-details">
                    <div className="item-img">
                        <img
                            className="user_profile_img"
                            // src="/assets/dashboard/images/avatar.png"
                            src={
                                data.image ||
                                '/assets/dashboard/images/avatar.png'
                            }
                            alt="child"
                        />
                    </div>
                    <div className="item-content">
                        <div className="header-inline item-header details_header">
                            <h3 className="text-dark-medium profile_name font-medium">
                                {data.name}
                            </h3>
                            <div className="header-elements">
                                {/* <ul>
                                    <li>
                                        <a href="">
                                            <span className="material-symbols-outlined fill">
                                                edit_square
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <span className="material-symbols-outlined fill">
                                                print
                                            </span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <span className="material-symbols-outlined fill">
                                                system_update_alt
                                            </span>
                                        </a>
                                    </li>
                                </ul> */}
                            </div>
                        </div>
                        <ul className="section_naviagation">
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/basic-information`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Basic informations
                                </NavLink>
                            </li>
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/academic-information`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Academic informations
                                </NavLink>
                            </li>
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/document`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Documents
                                </NavLink>
                            </li>
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/parent`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Parents
                                </NavLink>
                            </li>
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/skill`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Skills
                                </NavLink>
                            </li>
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/language`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Languages
                                </NavLink>
                            </li>
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/contact-number`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Contact Numbers
                                </NavLink>
                            </li>
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/educational-background`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Educational Backgrounds
                                </NavLink>
                            </li>
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/payments`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    {/* to={`/profile/payments`} className={({ isActive }) =>
                                                isActive
                                                    ? 'active_nav_link'
                                                    : 'normal_nav_link'
                                            }> */}
                                    Payments
                                </NavLink>
                            </li>
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/dues`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Dues
                                </NavLink>
                            </li>
                            {/* <li className="active_Li">
                                <NavLink
                                    to={`/profile/mark-sheet`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Result Part
                                </NavLink>
                            </li> */}
                            <li className="active_Li">
                                <NavLink
                                    to={`/profile/complain`}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'active_nav_link'
                                            : 'normal_nav_link'
                                    }
                                >
                                    Complain
                                </NavLink>
                            </li>
                            {/* <li className="active_Li">
                                <Link to={`/profile/review`} className={({ isActive }) =>
                                                isActive
                                                    ? 'active_nav_link'
                                                    : 'normal_nav_link'
                                            }>
                                    Review
                                </Link>
                            </li> */}
                        </ul>
                        <div></div>
                        <div className="info-table table-responsive">
                            <Outlet></Outlet>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleStudent;
