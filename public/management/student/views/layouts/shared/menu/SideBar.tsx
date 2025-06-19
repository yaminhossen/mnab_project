/* eslint-disable no-undef */
import React, { useState } from 'react';
import MenuDropDown from './MenuDropDown';
import MenuDropDownItem from './MenuDropDownItem';
import MenuSingle from './MenuSingle';
import axios from 'axios';
import { anyObject } from '../../../../../admin/common_types/object';
export interface Props {}

const SideBar: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    setTimeout(() => {
        init_nav_action();
        active_link(window.location.href);
    }, 1000);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            let confirm = await (window as anyObject).s_confirm('Logout');
            if (confirm) {
                await axios.post('/api/v1/auth/student/logout');
            }
        } catch (error) {
            setError(error);
        }
    };
    return (
        <>
            <ul className="sidebar-menu">
                <MenuSingle to="/" icon="icon-home" label="Dashboard" />
                <MenuSingle
                    to="/profile/basic-information"
                    icon="icon-user"
                    label="Profile"
                />
                <MenuSingle
                    to="/class-routine"
                    icon="icon-calendar"
                    label="Class Routine"
                />
                <MenuSingle
                    to="/exam-routine"
                    icon="icon-book"
                    label="Exam Routine"
                />
                <MenuSingle
                    to="/mark-sheet"
                    icon="icon-book"
                    label="Mark Sheet"
                />
                <MenuSingle
                    to="/attendance"
                    icon="icon-receipt"
                    label="Attendance"
                />

                {/* <MenuDropDown
                    section_title=""
                    group_title="Fee"
                    icon="icon-money"
                >
                    <MenuDropDownItem label="Payment History" to="/fees" />
                    <MenuDropDownItem label="Due List" to="/fees/dues" />
                </MenuDropDown> */}

                <MenuSingle
                    to="/fees"
                    icon="icon-notepad"
                    label="Payment History"
                />
                <MenuSingle
                    to="/fees/dues"
                    icon="icon-notepad"
                    label="Due List"
                />
                {/* <MenuSingle
                    to="/leave-application/approved"
                    icon="icon-notepad"
                    label="Leave Application"
                /> */}
                <MenuSingle
                    to="/academic-resources"
                    icon="icon-server"
                    label="Academic Resources"
                />
                <MenuSingle
                    to="/assignments"
                    icon="icon-server"
                    label="Assignments"
                />
                <MenuSingle to="/notices" icon="icon-bell" label="Notices" />
                {/* <MenuSingle
                    to="/activities"
                    icon="icon-ruler-pencil"
                    label="My Activities"
                /> */}
                {/* <MenuSingle to="/" icon="icon-bookmark-alt" label="Reports" /> */}
                <MenuSingle
                    to="/settings"
                    icon="icon-receipt"
                    label="Settings"
                />
                <MenuSingle
                    onClick={handleSubmit}
                    to=""
                    icon="icon-power-off"
                    label="Logout"
                />
                {/* <MenuSingle to="/" icon="icon-power-off" label="Logout" /> */}

                {/* <li>
                    <a
                        href="http://admin.pixelstrap.com/universal/default/maintenance.html"
                        className="sidebar-header"
                    >
                        <i className="icon-settings" />
                        <span>Maintenance</span>
                    </a>
                </li> */}
            </ul>
        </>
    );
};

function active_link(hash) {
    let url = new URL(hash);
    (window as any).$(`.sidebar-submenu a`).removeClass('active');
    (window as any)
        .$(`.sidebar-submenu a[href="${url.hash}"]`)
        .addClass('active');
}
function init_nav_action() {
    var animationSpeed = 300,
        subMenuSelector = '.sidebar-submenu';
    (window as any).$('.sidebar-menu').on('click', 'li a', function (e) {
        var $this = (window as any).$(this);
        var checkElement = $this.next();
        if (checkElement.is(subMenuSelector) && checkElement.is(':visible')) {
            checkElement.slideUp(animationSpeed, function () {
                checkElement.removeClass('menu-open');
            });
            checkElement.parent('li').removeClass('active');
        } else if (
            checkElement.is(subMenuSelector) &&
            !checkElement.is(':visible')
        ) {
            var parent = $this.parents('ul').first();
            var ul = parent.find('ul:visible').slideUp(animationSpeed);
            ul.removeClass('menu-open');
            var parent_li = $this.parent('li');
            checkElement.slideDown(animationSpeed, function () {
                checkElement.addClass('menu-open');
                parent.find('li.active').removeClass('active');
                parent_li.addClass('active');
            });
        }

        if (e.target && e.target.href && e.target.href.includes('http')) {
            active_link(e.target.href);
        }
    });
}

export default SideBar;
