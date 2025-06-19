import React, { useState, useEffect } from 'react';
import { anyObject } from '../../../common_types/object';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import { all } from './config/store/async_actions/all';
import storeSlice from './config/store';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../store';
import setup from './config/setup';
import Paginate from '../../components/Paginate';
export interface Props {}

const Index: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(storeSlice.actions.set_select_fields('id, status'));
        dispatch(all({}) as any);
    }, []);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }

    useEffect(() => {
        // Function to fetch data
    }, []);
    console.log('notice all from state', state?.all);

    console.log(data);
    function yearFormate(date: string) {
        return moment(date).year();
    }
    function dateFormate(date: string) {
        return moment(date).date();
    }
    function monthFormate(date: string) {
        return moment(date).format('MMM');
    }
    function truncateWords(text, maxWords) {
        const words = text.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return text;
    }
    return (
        <div className="admin_dashboard">
            <div className="row my-4">
                <div className="col-md-6">
                    <div className="content_body mt-2 mb-2">
                        <div className="data_list">
                            <Paginate
                                set_url={storeSlice.actions.set_url}
                                set_paginate={storeSlice.actions.set_paginate}
                                set_page={storeSlice.actions.set_page}
                                all={all}
                                data={state?.all as any}
                                selected_paginate={state?.paginate}
                            ></Paginate>
                        </div>
                    </div>
                    <div className="notice_area_content">
                        {(state.all as any)?.data?.length ? (
                            <ul>
                                {(state?.all as any)?.data?.map(
                                    (i: { [key: string]: any }, index) => {
                                        return (
                                            <li>
                                                <div className="notice">
                                                    <div className="date_area">
                                                        <div className="day_and_month_area">
                                                            <p className="text_day">
                                                                {dateFormate(
                                                                    i.updated_at,
                                                                )}
                                                            </p>
                                                            <p className="text_month">
                                                                {monthFormate(
                                                                    i.updated_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="year_area">
                                                            <p className="text_year">
                                                                {yearFormate(
                                                                    i.updated_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="notice_title_and_description_area">
                                                        <div className="notice_title">
                                                            {/* <a
                                                            href="notice_details.html"
                                                            className="title_text"
                                                        >
                                                            9, 10, 11 তারিখ
                                                            মাদরাসা 9, 10, 11
                                                            তারিখ মাদরাসা বন্ধ
                                                            থাকবে
                                                        </a> */}
                                                            <Link
                                                                className="title_text"
                                                                to={`/notices/details/${i.id}`}
                                                            >
                                                                {i.title}
                                                            </Link>
                                                        </div>
                                                        <div className="notice_description">
                                                            <span className="description_text">
                                                                {truncateWords(
                                                                    i.description,
                                                                    15,
                                                                )}
                                                                <Link
                                                                    className="read_more_area"
                                                                    to={`/notices/details/${i.id}`}
                                                                >
                                                                    Read more
                                                                    ...
                                                                </Link>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    },
                                )}
                            </ul>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan={9}>
                                        <div
                                            style={{
                                                fontSize: '24px',
                                            }}
                                            className="not_found f-size-4 m-4"
                                        >
                                            No data found
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </div>
                    {/* <Paginate
                        set_url={storeSlice.actions.set_url}
                        set_paginate={storeSlice.actions.set_paginate}
                        set_page={storeSlice.actions.set_page}
                        all={all}
                        data={state?.all as any}
                        selected_paginate={state?.paginate}
                    ></Paginate> */}
                </div>
            </div>
        </div>
    );
};

export default Index;
