import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RootState, useAppDispatch } from '../../../store';
import axios from 'axios';
import moment from 'moment/moment';
export interface Props {}

const ClassRoutine: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    const dispatch = useAppDispatch();
    const params = useParams();
    const fetchData = async () => {
        try {
            const response = await axios.get(
                '/api/v1/branch-classes/class-routine-auth',
            );
            setData(response.data?.data?.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="admin_dashboard">
            <div className="class_schedule_content">
                {/* table_area start */}
                <table className="table_area routine_table">
                    {/* table_head area start */}
                    <thead>
                        <tr className="table_head_area">
                            {/* <th className="head_class_title">
                                            class name
                                        </th>
                                        <th className="head_batch_title">
                                            batch
                                        </th> */}
                            <th className="head_subject_title">subject</th>
                            <th className="head_day_time_room_title">
                                <span className="head_day_time_room head_day">
                                    saturday
                                </span>
                                <span className="head_day_time_room head_time_and_room">
                                    <span className="head_time">time</span>
                                    <span className="head_silash">/</span>
                                    <span className="head_room">room</span>
                                </span>
                            </th>
                            <th className="head_day_time_room_title">
                                <span className="head_day_time_room head_day">
                                    sunday
                                </span>
                                <span className="head_day_time_room head_time_and_room">
                                    <span className="head_time">time</span>
                                    <span className="head_silash">/</span>
                                    <span className="head_room">room</span>
                                </span>
                            </th>
                            <th className="head_day_time_room_title">
                                <span className="head_day_time_room head_day">
                                    monday
                                </span>
                                <span className="head_day_time_room head_time_and_room">
                                    <span className="head_time">time</span>
                                    <span className="head_silash">/</span>
                                    <span className="head_room">room</span>
                                </span>
                            </th>
                            <th className="head_day_time_room_title">
                                <span className="head_day_time_room head_day">
                                    tuesday
                                </span>
                                <span className="head_day_time_room head_time_and_room">
                                    <span className="head_time">time</span>
                                    <span className="head_silash">/</span>
                                    <span className="head_room">room</span>
                                </span>
                            </th>
                            <th className="head_day_time_room_title">
                                <span className="head_day_time_room head_day">
                                    wednesday
                                </span>
                                <span className="head_day_time_room head_time_and_room">
                                    <span className="head_time">time</span>
                                    <span className="head_silash">/</span>
                                    <span className="head_room">room</span>
                                </span>
                            </th>
                            <th className="head_day_time_room_title">
                                <span className="head_day_time_room head_day">
                                    thursday
                                </span>
                                <span className="head_day_time_room head_time_and_room">
                                    <span className="head_time">time</span>
                                    <span className="head_silash">/</span>
                                    <span className="head_room">room</span>
                                </span>
                            </th>
                            <th className="head_day_time_room_title">
                                <span className="head_day_time_room head_day">
                                    friday
                                </span>
                                <span className="head_day_time_room head_time_and_room">
                                    <span className="head_time">time</span>
                                    <span className="head_silash">/</span>
                                    <span className="head_room">room</span>
                                </span>
                            </th>
                        </tr>
                    </thead>
                    {/* table_head area end */}
                    <tbody>
                        {data.length ? (
                            data.map((i, index) => (
                                <tr className="table_body" key={index}>
                                    <td className="subject">
                                        {i.subject?.name}
                                    </td>
                                    {i.routines?.map((r, rIndex) => (
                                        <td
                                            className="class_time_and_room_content"
                                            key={rIndex}
                                        >
                                            {rIndex ===
                                            i.routines.length - 1 ? (
                                                    <span className="class_time_and_room">
                                                    <span className="holiday_text">
                                                        FRIDAY
                                                        </span>
                                                    </span>
                                                ) : (
                                                <span className="class_time_and_room">
                                                        <span className="time_rooom class_time">
                                                        {moment(
                                                            r.start_time,
                                                                'HH:mm:ss',
                                                        ).format(
                                                                'hh:mm A',
                                                        )}{' '}
                                                        -{' '}
                                                        {moment(
                                                            r.end_time,
                                                                'HH:mm:ss',
                                                        ).format('hh:mm A')}
                                                        </span>
                                                    <span className="time_rooom class_room">
                                                        <span className="room_title">
                                                            {r.room?.room_name}
                                                            </span>
                                                    </span>
                                                        <span className="time_rooom class_room">
                                                        <span className="room_title">
                                                                {
                                                                r.b_teacher
                                                                        ?.teacher
                                                                        ?.name
                                                            }
                                                            </span>
                                                            <span className="dash_title">
                                                            -
                                                            </span>
                                                        <span className="room_number">
                                                            sir
                                                            </span>
                                                        </span>
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9}>
                                    <div
                                        style={{
                                            fontSize: '24px',
                                            color: 'white',
                                        }}
                                        className="not_found routine_not_found f-size-4 m-4"
                                    >
                                        No data found
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* table_area end */}
            </div>
        </div>
    );
};

export default ClassRoutine;
