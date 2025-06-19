import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { store } from './config/store/async_actions/store';
import axios from 'axios';
import moment from 'moment/moment';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import storeSlice from './config/store';
import { classes } from './config/store/async_actions/classes';
export interface Props {}

const ClassRoutine: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [s_class, setSclass] = useState();
    const [sections, setSections] = useState<any>([]);
    const [section, setSection] = useState({});
    const [selectedClassId, setSelectedClassId] = useState('');

    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();
    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        try {
            const response = await axios.post(
                '/api/v1/branch-classes/class-routine',
                formData,
            );
            console.log('ksdfjlsdjfldsjok');

            setData(response.data.data.data);
            setSclass(response.data.data.s_class);
            setSection(response.data.data.section);
        } catch (error) {
            setError(error);
        }
    };

    async function initdependancy() {
        await dispatch(storeSlice.actions.set_item({}));
        await dispatch(classes({}) as any);
        // await dispatch(sections({}) as any);
    }

    useEffect(() => {
        initdependancy();
    }, []);

    const handleChange2 = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        let id = event.target.value;
        setSelectedClassId(id);
        try {
            const response = await axios.get(
                `/api/v1/branch-class-sections/class-wise/${id}`,
            );
            setSections(response.data.data);
        } catch (error) {
            setError(error);
        }
        console.log('Selected value:', event.target.value);
    };

    return (
        <div className="admin_dashboard">
            {/* <h2>Class routine information</h2> */}
            <div className="admin_sideba custom_scroll">
                <section className="class_schedule_area">
                    <div className="container">
                        {/* class_schedule_title start */}
                        <div className="class_schedule_title">
                            <h2>class Routine</h2>
                            <form
                                onSubmit={(e) => handleSubmit(e)}
                                className="form_600 mx-auto pt-3"
                            >
                                <div className="mt-4 d-flex text-left">
                                    <div className="form-group form-vertical">
                                        <label>Class</label>
                                        <div className="form_elements">
                                            <select
                                                name="branch_class_id"
                                                id=""
                                                onChange={handleChange2}
                                                value={selectedClassId}
                                            >
                                                <option value="">
                                                    Select Class
                                                </option>
                                                {state?.classes?.length &&
                                                    state.classes?.map(
                                                        (i: {
                                                            [key: string]: any;
                                                        }) => {
                                                            return (
                                                                <option
                                                                    value={i.id}
                                                                >
                                                                    {i.name}
                                                                </option>
                                                            );
                                                        },
                                                    )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group form-vertical">
                                        <label>Section</label>
                                        <div className="form_elements">
                                            {sections.length > 0 ? (
                                                <select
                                                    name="branch_class_section_id"
                                                    disabled={
                                                        !selectedClassId ||
                                                        sections.length === 0
                                                    }
                                                >
                                                    <option value="">
                                                        Select section
                                                    </option>
                                                    {sections.map(
                                                        (i, index) => (
                                                            <option
                                                                key={i.id}
                                                                value={i.id}
                                                            >
                                                                {i.title}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            ) : (
                                                <div
                                                    style={{
                                                        fontSize: '14px',
                                                        color: 'black',
                                                    }}
                                                    className="not_found_text"
                                                >
                                                    At First Select Class
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group student_submit form-horizontal">
                                        <label></label>
                                        <div className="form_elements">
                                            <button className="btn btn_1">
                                                submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* class_schedule_title end */}
                        <div className="class_schedule_content">
                            {/* table_area start */}
                            <table className="table_area">
                                {/* table_head area start */}
                                <thead>
                                    <tr className="table_head_area">
                                        <th className="head_class_title">
                                            class name
                                        </th>
                                        <th className="head_batch_title">
                                            batch
                                        </th>
                                        <th className="head_subject_title">
                                            subject
                                        </th>
                                        <th className="head_day_time_room_title">
                                            <span className="head_day_time_room head_day">
                                                saturday
                                            </span>
                                            <span className="head_day_time_room head_time_and_room">
                                                <span className="head_time">
                                                    time
                                                </span>
                                                <span className="head_silash">
                                                    /
                                                </span>
                                                <span className="head_room">
                                                    room
                                                </span>
                                            </span>
                                        </th>
                                        <th className="head_day_time_room_title">
                                            <span className="head_day_time_room head_day">
                                                sunday
                                            </span>
                                            <span className="head_day_time_room head_time_and_room">
                                                <span className="head_time">
                                                    time
                                                </span>
                                                <span className="head_silash">
                                                    /
                                                </span>
                                                <span className="head_room">
                                                    room
                                                </span>
                                            </span>
                                        </th>
                                        <th className="head_day_time_room_title">
                                            <span className="head_day_time_room head_day">
                                                monday
                                            </span>
                                            <span className="head_day_time_room head_time_and_room">
                                                <span className="head_time">
                                                    time
                                                </span>
                                                <span className="head_silash">
                                                    /
                                                </span>
                                                <span className="head_room">
                                                    room
                                                </span>
                                            </span>
                                        </th>
                                        <th className="head_day_time_room_title">
                                            <span className="head_day_time_room head_day">
                                                tuesday
                                            </span>
                                            <span className="head_day_time_room head_time_and_room">
                                                <span className="head_time">
                                                    time
                                                </span>
                                                <span className="head_silash">
                                                    /
                                                </span>
                                                <span className="head_room">
                                                    room
                                                </span>
                                            </span>
                                        </th>
                                        <th className="head_day_time_room_title">
                                            <span className="head_day_time_room head_day">
                                                wednesday
                                            </span>
                                            <span className="head_day_time_room head_time_and_room">
                                                <span className="head_time">
                                                    time
                                                </span>
                                                <span className="head_silash">
                                                    /
                                                </span>
                                                <span className="head_room">
                                                    room
                                                </span>
                                            </span>
                                        </th>
                                        <th className="head_day_time_room_title">
                                            <span className="head_day_time_room head_day">
                                                thursday
                                            </span>
                                            <span className="head_day_time_room head_time_and_room">
                                                <span className="head_time">
                                                    time
                                                </span>
                                                <span className="head_silash">
                                                    /
                                                </span>
                                                <span className="head_room">
                                                    room
                                                </span>
                                            </span>
                                        </th>
                                        <th className="head_day_time_room_title">
                                            <span className="head_day_time_room head_day">
                                                friday
                                            </span>
                                            <span className="head_day_time_room head_time_and_room">
                                                <span className="head_time">
                                                    time
                                                </span>
                                                <span className="head_silash">
                                                    /
                                                </span>
                                                <span className="head_room">
                                                    room
                                                </span>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                {/* table_head area end */}
                                <tbody>
                                    {/* table_body area start */}
                                    <tr className="table_body">
                                        <td rowSpan={9}>{s_class?.name}</td>
                                    </tr>
                                    <tr className="table_body">
                                        <td rowSpan={9}>{section?.title}</td>
                                    </tr>
                                    {data.length ? (
                                        data.map((i, index) => (
                                            <tr
                                                className="table_body"
                                                key={index}
                                            >
                                                <td className="subject">
                                                    {i.subject?.name}
                                                </td>
                                                {i.routines?.map(
                                                    (r, rIndex) => (
                                                        <td
                                                            className="class_time_and_room_content"
                                                            key={rIndex}
                                                        >
                                                            {rIndex ===
                                                            i.routines.length -
                                                                1 ? (
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
                                                                        ).format(
                                                                            'hh:mm A',
                                                                        )}
                                                                    </span>
                                                                    <span className="time_rooom class_room">
                                                                            <span className="room_title">
                                                                            {
                                                                                r
                                                                                    .room
                                                                                    ?.room_name
                                                                            }
                                                                        </span>
                                                                        </span>
                                                                    <span className="time_rooom class_room">
                                                                            <span className="room_title">
                                                                            {
                                                                                r
                                                                                    .b_teacher
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
                                                    ),
                                                )}
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
                </section>
            </div>
        </div>
    );
};

export default ClassRoutine;
