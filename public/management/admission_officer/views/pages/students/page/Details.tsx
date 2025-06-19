import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
// import { all } from './config/store/async_actions/all';
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
import { class_details1 } from '../config/store/async_actions/class_details1';
import { Link, useParams } from 'react-router-dom';
import Paginate2 from '../../../components/Paginate2';
import Header2 from '../components/all_data_page/Header2';
import BackButton from './components/BackButton';

export interface Props {}

const ClassDetails: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();
    console.log('param id', params.id);

    useEffect(() => {
        dispatch(storeSlice.actions.set_select_fields('id'));
        dispatch(class_details1({ id: params.id }) as any);
    }, []);

    function quick_view(data: anyObject = {}) {
        dispatch(storeSlice.actions.set_item(data));
        dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
    }
    // console.log('state date', (state.class_details1 as any)?.data?.length);

    return (
        <>
            <BackButton />
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header2></Header2>
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
                                            <th>No.</th>
                                            <TableHeading
                                                label={`ID`}
                                                col_name={`id`}
                                                sort={false}
                                            />
                                            {/* <th>Serial</th> */}
                                            <th>Image</th>
                                            <TableHeading
                                                label={`Name`}
                                                col_name={`name`}
                                                sort={false}
                                            />
                                            <th>Student Id</th>
                                            <TableHeading
                                                label={`Role`}
                                                col_name={`role`}
                                                sort={false}
                                            />
                                            <TableHeading
                                                label={`Class`}
                                                col_name={`class`}
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
                                            {(state.all as any)?.data?.map(
                                                (
                                                    i: { [key: string]: any },
                                                    index: number,
                                                ) => (
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
                                                            <SelectItem
                                                                item={i}
                                                            />
                                                        </td>
                                                        <td>
                                                            <span>
                                                                {index + 1}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span
                                                                className="quick_view_trigger"
                                                                onClick={() =>
                                                                    quick_view(
                                                                        i,
                                                                    )
                                                                }
                                                            >
                                                                {i.id}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <img
                                                                src={
                                                                    i
                                                                        .branchstudent
                                                                        ?.image
                                                                        ? i
                                                                            .branchstudent
                                                                            ?.image
                                                                        : '/assets/dashboard/images/avatar.png'
                                                                }
                                                                alt=""
                                                                style={{
                                                                    height: 30,
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            {
                                                                i.branchstudent
                                                                    ?.name
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                i.infostudent
                                                                    ?.student_id
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                i.infostudent
                                                                    ?.role_no
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                i.infostudent
                                                                    ?.class
                                                                    ?.name
                                                            }
                                                        </td>

                                                        <td>
                                                            <Link
                                                                // to="/students/single/student/"
                                                                to={`/students/single/student/${i.branch_student_id}`}
                                                                className="btn btn-sm  btn-outline-info"
                                                                type="submit"
                                                            >
                                                                Details
                                                            </Link>
                                                            <Link
                                                                // to="/students/update"
                                                                to={`/students/edit/${i.branch_student_id}`}
                                                                className="btn btn-sm ml-2  btn-outline-info"
                                                                type="submit"
                                                            >
                                                                Edit
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan={10}>
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

                            <Paginate2
                                set_url={storeSlice.actions.set_url}
                                set_id={Number(params.id)}
                                set_paginate={storeSlice.actions.set_paginate}
                                set_page={storeSlice.actions.set_page}
                                all={class_details1}
                                data={state.all as any}
                                selected_paginate={state.paginate}
                            ></Paginate2>
                        </div>
                    </div>
                    {/* <TableFooter></TableFooter> */}
                </div>

                <Filter></Filter>
                <QuickView></QuickView>
            </div>
        </>
    );
};

export default ClassDetails;
