import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { all } from '.././config/store/async_actions/all';
import setup from '.././config/setup';
import { initialState } from '.././config/store/inital_state';
import Header from '.././components/all_data_page/Header';
import TableFooter from '.././components/all_data_page/TableFooter';
import Paginate from '../../../components/Paginate';
import Filter from '.././components/canvas/Filter';
import QuickView from '.././components/canvas/QuickView';
import storeSlice from '.././config/store';
import { anyObject } from '../../../../common_types/object';
import TableRowAction from '.././components/all_data_page/TableRowAction';
import SelectItem from '.././components/all_data_page/SelectItem';
import SelectAll from '.././components/all_data_page/SelectIAll';
import TableHeading from '.././components/all_data_page/TableHeading';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';
import { teacher_complete } from '../config/store/async_actions/teacher_complete';
import HeadSearch from '../components/all_data_page/HeadSearch';
import HeadRightButtons from '../components/all_data_page/HeadRightButtons';
import axios from 'axios';
import HeadSearchComplete from '../components/all_data_page/HeadSearchComplete';
import FilterComplete from '../components/canvas/FilterComplete';

export interface Props {}

const Pending: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const [error, setError] = useState(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(storeSlice.actions.set_select_fields('id, status'));
        dispatch(teacher_complete({}) as any);
    }, []);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }
    // let date = moment().format('YYYY-MM-DD');

    const handleConfirmSubmit = async (id) => {
        // const confirmed = (window as any).s_confirm('Are you sure you want to submit?');
        let confirm = await (window as anyObject).s_confirm('Are you sure');
        console.log('thsis is the id', id);
        // if (!confirmed) return;
        if (confirm) {
            try {
                console.log('it is confirmed');
                const response = await axios.post(
                    `/api/v1/tasks/teacher-update/${id}`,
                );
            } catch (error) {
                setError(error);
            }
        }
    };

    return (
        <div className="page_content">
            <div className="explore_window pending_explore_window fixed_size">
                <div className="action_bar">
                    <div className="navigation">
                        <ul>
                            <li className="search_li">
                                <HeadSearchComplete></HeadSearchComplete>
                            </li>
                        </ul>
                    </div>
                    <div className="title no_move" id="users_drag">
                        <h2>
                            All Completed Task
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
                                        {/* <th /> */}
                                        {/* <th></th> */}
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
                                            label={`Title`}
                                            col_name={`title`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Description`}
                                            col_name={`description`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Date`}
                                            col_name={`date`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Action`}
                                            col_name={`action`}
                                            sort={false}
                                        />
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    {(state.all as any)?.data?.map(
                                        (i: { [key: string]: any }, index) => {
                                            return (
                                                <tr
                                                    key={i.id}
                                                    className={`table_rows table_row_${i.id}`}
                                                >
                                                    {/* <td>
                                                        <TableRowAction
                                                            item={i}
                                                        />
                                                    </td> */}
                                                    {/* <td>
                                                        <SelectItem item={i} />
                                                    </td> */}
                                                    <td>
                                                        <span
                                                            className="quick_view_trigger"
                                                            onClick={() =>
                                                                quick_view(i)
                                                            }
                                                        >
                                                            {index + 1}
                                                        </span>
                                                    </td>
                                                    {/* <td>
                                                        <Link
                                                            to={`/${setup.route_prefix}/assign/${i.id}`}
                                                        >
                                                            <span className="agenda_btn">
                                                                assign
                                                            </span>
                                                        </Link>
                                                    </td> */}
                                                    <td>{i.tasks?.title}</td>
                                                    <td>
                                                        {i.tasks?.description}
                                                    </td>
                                                    <td>
                                                        {moment(
                                                            i.tasks?.date,
                                                        ).format('YYYY-MM-DD')}
                                                    </td>
                                                    <td>
                                                        <Link
                                                            // to="/students/single/student/"
                                                            to={`/${setup.route_prefix}/details/complete/${i.tasks?.id}`}
                                                            className="btn btn-sm  btn-outline-info ml-2"
                                                            type="submit"
                                                        >
                                                            Show
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Paginate
                            set_url={storeSlice.actions.set_url}
                            set_paginate={storeSlice.actions.set_paginate}
                            set_page={storeSlice.actions.set_page}
                            all={teacher_complete}
                            data={state.all as any}
                            selected_paginate={state.paginate}
                        ></Paginate>
                    </div>
                </div>
                {/* <TableFooter></TableFooter> */}
            </div>

            <FilterComplete></FilterComplete>
            <QuickView></QuickView>
        </div>
    );
};

export default Pending;
