import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { all } from '../config/store/async_actions/all';
import setup from '../config/setup';
import { initialState } from '../config/store/inital_state';
import Header from '../components/all_data_page/Header';
import TableFooter from '../components/all_data_page/TableFooter';
import Paginate from '../../../components/Paginate';
import Filter from '../components/canvas/Filter';
import QuickView from '../components/canvas/QuickView';
import storeSlice from '../config/store';
import { anyObject } from '../../../../common_types/object';
import TableRowAction from '../components/all_data_page/TableRowAction';
import SelectItem from '../components/all_data_page/SelectItem';
import SelectAll from '../components/all_data_page/SelectIAll';
import TableHeading from '../components/all_data_page/TableHeading';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';
import HeadSearch from '../components/all_data_page/HeadSearch';
import HeadRightButtons from '../components/all_data_page/HeadRightButtons';
import axios from 'axios';
import { approved } from '../config/store/async_actions/approved';

export interface Props {}

const Approved: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const [error, setError] = useState(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(
            storeSlice.actions.set_select_fields(
                'id, status, attachments, start_date, end_date, leave_status, total_days',
            ),
        );
        dispatch(approved({}) as any);
    }, []);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }
    console.log('state all form leave approved', state?.all);

    return (
        <div className="page_content">
            <div className="explore_window pending_explore_window fixed_size">
                <div className="action_bar">
                    <div className="navigation">
                        <ul>
                            <li className="search_li">
                                <HeadSearch></HeadSearch>
                            </li>
                        </ul>
                    </div>
                    <div className="title no_move" id="users_drag">
                        <h2>
                            All Approved Task
                            {/* {state.is_loading && <span> loading..</span>} */}
                        </h2>
                    </div>
                    <div className="control">
                        <HeadRightButtons></HeadRightButtons>
                    </div>
                </div>

                <div className="content_body">
                    <div className="data_list">
                        <div className="table_responsive custom_scroll">
                            <table>
                                <thead>
                                    <tr>
                                        {/* <th />
                                        <th></th> */}
                                        {/* <th>
                                            <SelectAll />
                                        </th>
                                        <TableHeading
                                            label={`ID`}
                                            col_name={`id`}
                                            sort={true}
                                        />
                                        <TableHeading
                                            label={`Assign Task`}
                                            col_name={`assign task`}
                                            sort={false}
                                        /> */}
                                        <th>Serial</th>
                                        <TableHeading
                                            label={`Type`}
                                            col_name={`type`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Description`}
                                            col_name={`description`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Start date`}
                                            col_name={`start date`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`End date`}
                                            col_name={`end date`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Total days`}
                                            col_name={`total days`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Action`}
                                            col_name={`action`}
                                            sort={false}
                                        />
                                    </tr>
                                </thead>
                                {(state.all as any)?.data?.length ? (
                                    <tbody id="all_list">
                                        {(state?.all as any)?.data?.map(
                                            (
                                                i: { [key: string]: any },
                                                index,
                                            ) => {
                                                return (
                                                    <tr
                                                        key={i.id}
                                                        className={`table_rows table_row_${i.id}`}
                                                    >
                                                        <td>
                                                            <span
                                                                className="quick_view_trigger"
                                                                // onClick={() =>
                                                                //     quick_view(i)
                                                                // }
                                                            >
                                                                {index + 1}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {
                                                                i.leave_type
                                                                    ?.title
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                i.leave_type
                                                                    ?.description
                                                            }
                                                        </td>
                                                        <td>
                                                            {moment(
                                                                i.start_date,
                                                            ).format(
                                                                'YYYY-MM-DD',
                                                            )}
                                                        </td>
                                                        <td>
                                                            {moment(
                                                                i.end_date,
                                                            ).format(
                                                                'YYYY-MM-DD',
                                                            )}
                                                        </td>
                                                        <td>{i.total_days}</td>
                                                        <td>
                                                            <a
                                                                href={
                                                                    i.attachments ||
                                                                    undefined
                                                                }
                                                                target="blank"
                                                            >
                                                                show
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>
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
                            </table>
                        </div>

                        <Paginate
                            set_url={storeSlice.actions.set_url}
                            set_paginate={storeSlice.actions.set_paginate}
                            set_page={storeSlice.actions.set_page}
                            all={approved}
                            data={state.all as any}
                            selected_paginate={state.paginate}
                        ></Paginate>
                    </div>
                </div>
                {/* <TableFooter></TableFooter> */}
            </div>

            <Filter></Filter>
            <QuickView></QuickView>
        </div>
    );
};

export default Approved;
