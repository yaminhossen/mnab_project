import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { all } from './config/store/async_actions/all';
import setup from './config/setup';
import { initialState } from './config/store/inital_state';
import Header from './components/all_data_page/Header';
import TableFooter from './components/all_data_page/TableFooter';
import Paginate from '../../components/Paginate';
import Filter from './components/canvas/Filter';
import QuickView from './components/canvas/QuickView';
import storeSlice from './config/store';
import { anyObject } from '../../../common_types/object';
import TableRowAction from './components/all_data_page/TableRowAction';
import SelectItem from './components/all_data_page/SelectItem';
import SelectAll from './components/all_data_page/SelectIAll';
import TableHeading from './components/all_data_page/TableHeading';
import moment from 'moment/moment';
import { Link } from 'react-router-dom';

export interface Props {}

const All: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(
            storeSlice.actions.set_select_fields(
                'id, title, created_at, status',
            ),
        );
        dispatch(all({}) as any);
    }, []);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }
    let today = moment().format('YYYY-MM-DD');
    let nowTime = moment().format('hh:mm A');
    function dateFormate(date: string) {
        return moment(date).format('MM-D-YYYY');
    }
    return (
        <div className="page_content">
            <div className="explore_window fixed_size">
                <Header></Header>

                <div className="content_body">
                    <div className="data_list">
                        <div className="table_responsive custom_scroll">
                            <table>
                                <thead>
                                    <tr>
                                        {/* <th /> */}
                                        {/* <th>
                                            <SelectAll />
                                        </th> */}
                                        <TableHeading
                                            label={`Serial`}
                                            col_name={`serial`}
                                            sort={true}
                                        />
                                        {/* <th>Logo</th> */}
                                        <TableHeading
                                            label={`Title`}
                                            col_name={`title`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Subject`}
                                            col_name={`subject`}
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
                                {(state.all as any)?.data?.length ? (
                                    <tbody id="all_list">
                                        {/* {(state.all as any)?.data?.map( */}
                                        {(state.all as any)?.data?.map(
                                            (
                                                i: { [key: string]: any },
                                                index,
                                            ) => {
                                                return (
                                                    <tr
                                                        key={i.id}
                                                        className={`table_rows table_row_${i.id}`}
                                                    >
                                                        <td>{index + 1}</td>
                                                        <td>{i.title}</td>
                                                        <td>
                                                            {i.subject?.name}
                                                        </td>
                                                        <td>
                                                            {dateFormate(
                                                                i.updatedAt,
                                                            )}
                                                        </td>
                                                        <td>
                                                            <a
                                                                target="blank"
                                                                href={
                                                                    i.attachment
                                                                }
                                                                download={i.attachment
                                                                    .split('/')
                                                                    .pop()}
                                                            >
                                                                download
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
                            all={all}
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

export default All;
