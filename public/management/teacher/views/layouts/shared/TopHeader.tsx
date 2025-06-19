import React, { useState } from 'react';
import NavbarSwitch from './NavbarSwitch';
import { anyObject } from '../../../../admin/common_types/object';
import axios from 'axios';

export interface Props {}

const TopHeader: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            let confirm = await (window as anyObject).s_confirm('Logout');
            if (confirm) {
                await axios.post('/api/v1/auth/teacher/logout');
            }
        } catch (error) {
            setError(error);
        }
    };
    return (
        <>
            <div className="page-main-header">
                <div
                    className="main-header-left"
                    semilight-bg-color="bg-default-light-colo"
                >
                    <div className="logo-wrapper">
                        <a href="#/">
                            Nurul Hikma Model Madrasah
                            {/* <img
                                src="https://uniflexlimited.com/wp-content/uploads/2024/05/Untitled-1.png"
                                className="image-dark"
                            />
                            <img
                                src="https://uniflexlimited.com/wp-content/uploads/2024/05/Untitled-1.png"
                                className="image-light"
                            /> */}
                        </a>
                    </div>
                </div>
                <div
                    className="main-header-right row"
                    header-bg-color="bg-default-light-colo"
                >
                    <NavbarSwitch />
                    <div className="nav-right col">
                        <ul className="nav-menus">
                            {/* <li>
                      <form className="form-inline search-form">
                          <div className="form-group">
                              <label className="sr-only">Email</label>
                              <input type="search" className="form-control-plaintext" placeholder="Search..">
                              <span className="d-sm-none mobile-search">
                              </span>
                          </div>
                      </form>
                  </li> */}
                            {/* <li className="notification-bell">
                                <a href="#!" className="text-dark">
                                    <i className="icon-bell" />
                                    <span className="notification-badge">
                                        3
                                    </span>
                                </a>
                            </li> */}
                            {/* <li>
                                <a href="#!" className="text-dark">
                                    <img
                                        className="align-self-center pull-right me-2"
                                        src="/assets/dashboard_uni/browser.png"
                                        alt="header-browser"
                                    />
                                </a>
                            </li> */}
                            <li className="onhover-dropdown">
                                <div className="d-flex align-items-center">
                                    {/* <img
                                        className="align-self-center pull-right flex-shrink-0 me-2"
                                        src="/assets/dashboard_uni/user.png"
                                        alt="header-user"
                                    /> */}
                                    <div>
                                        <h6 className="m-0 txt-dark f-16">
                                            My Account
                                            <i className="fa fa-angle-down pull-right ms-2" />
                                        </h6>
                                    </div>
                                </div>
                                <ul className="profile-dropdown onhover-show-div p-20">
                                    <li>
                                        <a href="/teacher#/settings">
                                            <i className="icon-user" />
                                            Edit Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={handleSubmit} href="#">
                                            <i className="icon-power-off" />
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div className="d-lg-none mobile-toggle">
                            <i className="icon-more" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopHeader;
