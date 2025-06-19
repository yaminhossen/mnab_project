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
                'id, title, description, date, time, meeting_link, meeting_type, status',
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
                                        <th>
                                            <SelectAll />
                                        </th>
                                        <TableHeading
                                            label={`ID`}
                                            col_name={`id`}
                                            sort={true}
                                        />
                                        {/* <th>Logo</th> */}
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
                                            label={`Time`}
                                            col_name={`time`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Meeting Type`}
                                            col_name={`meeting_type`}
                                            sort={false}
                                        />
                                        <TableHeading
                                            label={`Meeting Link`}
                                            col_name={`meeting link`}
                                            sort={false}
                                        />
                                        {/* <TableHeading
                                            label={`Is Complete`}
                                            col_name={`is_complete`}
                                            sort={false}
                                        /> */}
                                        <TableHeading
                                            label={`Action`}
                                            col_name={`action`}
                                            sort={false}
                                        />
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    {/* {(state.all as any)?.data?.map( */}
                                    {(state.all as any)?.data?.map(
                                        (i: { [key: string]: any }) => {
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
                                                    <td>
                                                        <SelectItem item={i} />
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="quick_view_trigger"
                                                            // onClick={() =>
                                                            //     quick_view(i)
                                                            // }
                                                        >
                                                            {i.id}
                                                        </span>
                                                    </td>
                                                    {/* <td>
                                                    <img
                                                        src="/assets/dashboard/images/avatar.png"
                                                        alt=""
                                                        style={{
                                                            height: 30,
                                                        }}
                                                    />
                                                </td> */}
                                                    <td>{i.title}</td>
                                                    <td>{i.description}</td>
                                                    <td>
                                                        {moment(i.date).format(
                                                            'YYYY-MM-DD',
                                                        )}
                                                    </td>
                                                    <td>
                                                        {moment(
                                                            i.time,
                                                            'HH:mm:ss',
                                                        ).format('hh:mm A')}
                                                    </td>
                                                    <td>{i.meeting_type}</td>
                                                    <td>
                                                        {i.meeting_link ? (
                                                            moment(
                                                                i.date,
                                                            ).format(
                                                                'YYYY-MM-DD',
                                                            ) === today &&
                                                            moment().isBetween(
                                                                moment(
                                                                    `${i.date} ${i.time}`,
                                                                    'YYYY-MM-DD HH:mm:ss',
                                                                ).subtract(
                                                                    10,
                                                                    'minutes',
                                                                ),
                                                                moment(
                                                                    `${i.date} ${i.time}`,
                                                                    'YYYY-MM-DD HH:mm:ss',
                                                                ).add(
                                                                    4,
                                                                    'hour',
                                                                ),
                                                            ) ? (
                                                                <a
                                                                    href={
                                                                        i.meeting_link
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Click Here
                                                                    </a>
                                                            ) : (
                                                                'Link active 10 mins before on meeting times'
                                                            )
                                                        ) : (
                                                            'Offline meeting'
                                                        )}
                                                    </td>

                                                    {/* <td>
                                                        {i.meeting_link ? (
                                                            <a
                                                                href={
                                                                    i.meeting_link
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {moment(
                                                                    i.date,
                                                                ).format(
                                                                    'YYYY-MM-DD',
                                                                ) == today
                                                                    ? i.meeting_link
                                                                    : 'have more days'}
                                                            </a>
                                                        ) : (
                                                            'Offline meeting'
                                                        )}
                                                    </td> */}
                                                    <td>
                                                        <Link
                                                            // to="/students/single/student/"
                                                            to={`/${setup.route_prefix}/details/${i.id}`}
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
                            all={all}
                            data={state.all as any}
                            selected_paginate={state.paginate}
                        ></Paginate>
                    </div>
                </div>
                <TableFooter></TableFooter>
            </div>

            <Filter></Filter>
            <QuickView></QuickView>
        </div>
    );
};

export default All;
