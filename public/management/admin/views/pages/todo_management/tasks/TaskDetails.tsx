import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { useParams } from 'react-router-dom';
import storeSlice from './config/store';
import moment from 'moment/moment';
import { anyObject } from '../../../../common_types/object';
export interface Props {}

const TaskDetails: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const [error, setError] = useState(null);
    const [data, setData] = useState<anyObject[]>([]);
    const [data2, setData2] = useState<anyObject>({});

    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        // dispatch(details({ id: params.id }) as any);
    }, []);
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/api/v1/tasks/task-details/${params.id}`,
            );
            setData(response.data?.data?.data);
            setData2(response.data?.data?.data2);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    console.log('the task data', data);
    console.log('the task data2', data2);

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.details_page_title}></Header>

                    {/* {Object.keys(state.item).length && ( */}
                    <div className="content_body custom_scroll">
                        <table className="table quick_modal_table table-hover">
                            <tbody>
                                <tr>
                                    <td>Title</td>
                                    <td>:</td>
                                    <td>{data2.title}</td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>:</td>
                                    <td>{data2.description}</td>
                                </tr>
                                <tr>
                                    <td>Date</td>
                                    <td>:</td>
                                    <td>
                                        {moment(data2.date).format(
                                            'YYYY-MM-DD',
                                        )}
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td>Is completed</td>
                                    <td>:</td>
                                    <td>{data2.is_complete}</td>
                                </tr> */}
                            </tbody>
                        </table>
                        <div className="data_list">
                            <div className="table_responsive custom_scroll">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Serial</th>
                                            <th>User Type</th>
                                            <th>Name</th>
                                            <th>Image</th>
                                            <th>Number</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody id="all_list">
                                        {data.length &&
                                            data.map(
                                                (
                                                    i: { [key: string]: any },
                                                    index,
                                                ) => {
                                                    return (
                                                        <tr>
                                                            <td></td>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                {i.teacher
                                                                    ? 'Teacher'
                                                                    : 'Staff'}
                                                            </td>
                                                            <td>
                                                                {i.staff
                                                                    ?.name ||
                                                                    i.teacher
                                                                        ?.name}
                                                            </td>
                                                            <td>
                                                                <img
                                                                    src={
                                                                        i.staff
                                                                            ?.image ||
                                                                        i
                                                                            .teacher
                                                                            ?.image ||
                                                                        '/assets/dashboard/images/avatar.png'
                                                                    }
                                                                    alt="no image"
                                                                    height={30}
                                                                    width={30}
                                                                />
                                                                {/* {i.staff
                                                                    ?.name ||
                                                                    i.teacher
                                                                        ?.name} */}
                                                            </td>
                                                            <td>
                                                                {i.staff
                                                                    ?.phone_number ||
                                                                    i.teacher
                                                                        ?.phone_number}
                                                            </td>
                                                            <td>
                                                                {i.is_complete}
                                                            </td>
                                                        </tr>
                                                    );
                                                },
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* )} */}

                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default TaskDetails;
