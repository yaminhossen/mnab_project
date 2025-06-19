import React, { useEffect, useRef, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { store } from './config/store/async_actions/store';
import DropDown from './components/dropdown/DropDown';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import storeSlice from './config/store';
import { classes } from './config/store/async_actions/classes';
import { sections } from './config/store/async_actions/sections';
import { teachers } from './config/store/async_actions/teachers';
import { rooms } from './config/store/async_actions/rooms';
import axios from 'axios';
export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const teacherref = useRef<HTMLSelectElement>(null);
    const [teacher, setTeachers] = useState<any>(Number);
    const roomref = useRef<HTMLSelectElement>(null);
    const [room, setRooms] = useState<any>(Number);
    const [error, setError] = useState(null);
    const [section, setSections] = useState<any>([]);
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    async function handle_submit(e) {
        e.preventDefault();
        let response = await dispatch(store(new FormData(e.target)) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
        }
    }
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/api/v1/branch-class-room/class-wise/1`,
            );
            setSections(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    async function initdependancy() {
        await dispatch(storeSlice.actions.set_item({}));
        await dispatch(classes({}) as any);
        // await dispatch(sections({}) as any);
        await fetchData();
        await dispatch(teachers({}) as any);
        await dispatch(rooms({}) as any);
    }

    useEffect(() => {
        initdependancy();
    }, []);
    let days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    // defaultValue={moment(
    //     state.item
    //         .routine_day
    //         ?.start_time,
    //     'HH:mm:ss',
    // ).format(
    //     'HH:mm',
    // )}

    const handleChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        let id = event.target.value;
        setTeachers(id);
        let all_teacher =
            document.querySelectorAll<HTMLSelectElement>('.teacher');
        console.log('all teacher', all_teacher);
        all_teacher.forEach((select) => {
            select.value = id;
            console.log(select.value);
        });
    };

    const handleRoomChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        let id = event.target.value;
        setRooms(id);
        let all_rooms = document.querySelectorAll<HTMLSelectElement>('.room');
        console.log('all room', all_rooms);
        all_rooms.forEach((select) => {
            select.value = id;
            console.log(select.value);
        });
    };

    useEffect(() => {
        if (teacherref.current) {
            setTeachers(teacherref.current.value);
        }
    }, []);
    useEffect(() => {
        if (roomref.current) {
            setTeachers(roomref.current.value);
        }
    }, []);

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.create_page_title}></Header>
                    <div className="content_body custom_scroll">
                        <form
                            onSubmit={(e) => handle_submit(e)}
                            className="form_6002 mx-auto pt-3"
                        >
                            <div className="student_form">
                                <div className="full_width">
                                    <div className="form_section_heading">
                                        <h4>Class Subjects</h4>
                                    </div>
                                    <div className="multi_inputs">
                                        <div className="multi_input_group">
                                            <div className="d-flex">
                                                <div className="form-group form-vertical">
                                                    <label>Branch class</label>
                                                    <div className="form_elements">
                                                        <select
                                                            name="branch_class_id"
                                                            id=""
                                                        >
                                                            <option value="">
                                                                Select Class
                                                            </option>
                                                            {state?.classes
                                                                ?.length &&
                                                                state.classes?.map(
                                                                    (i: {
                                                                        [
                                                                            key: string
                                                                        ]: any;
                                                                    }) => {
                                                                        return (
                                                                            <option
                                                                                value={
                                                                                    i.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    i.name
                                                                                }
                                                                            </option>
                                                                        );
                                                                    },
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group form-vertical">
                                                    <label>Teacher</label>
                                                    <div className="form_elements">
                                                        <select
                                                            name="branch_teacher_id1"
                                                            id=""
                                                            ref={teacherref}
                                                            onChange={
                                                                handleChange
                                                            }
                                                        >
                                                            <option value="">
                                                                Select Teacher
                                                            </option>
                                                            {state?.teachers
                                                                ?.length &&
                                                                state.teachers?.map(
                                                                    (i: {
                                                                        [
                                                                            key: string
                                                                        ]: any;
                                                                    }) => {
                                                                        return (
                                                                            <option
                                                                                value={
                                                                                    i.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    i
                                                                                        .user_teacher
                                                                                        ?.name
                                                                                }
                                                                            </option>
                                                                        );
                                                                    },
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group form-vertical">
                                                    <label>
                                                        Branch class section
                                                    </label>
                                                    <div className="form_elements">
                                                        <select
                                                            name="branch_class_section_id"
                                                            id=""
                                                        >
                                                            <option value="">
                                                                Select section
                                                            </option>
                                                            {state?.sections
                                                                ?.length &&
                                                                state.sections?.map(
                                                                    (i: {
                                                                        [
                                                                            key: string
                                                                        ]: any;
                                                                    }) => {
                                                                        return (
                                                                            <option
                                                                                value={
                                                                                    i.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    i.title
                                                                                }
                                                                            </option>
                                                                        );
                                                                    },
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group form-vertical">
                                                    <label>Room</label>
                                                    <div className="form_elements">
                                                        <select
                                                            name="room_id"
                                                            id=""
                                                            ref={roomref}
                                                            onChange={
                                                                handleRoomChange
                                                            }
                                                        >
                                                            <option value="">
                                                                Select Room
                                                            </option>
                                                            {state?.rooms
                                                                ?.length &&
                                                                state.rooms?.map(
                                                                    (i: {
                                                                        [
                                                                            key: string
                                                                        ]: any;
                                                                    }) => {
                                                                        return (
                                                                            <option
                                                                                value={
                                                                                    i.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    i.room_name
                                                                                }
                                                                            </option>
                                                                        );
                                                                    },
                                                                )}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group form-vertical">
                                                    <label>Name</label>
                                                    <div className="form_elements">
                                                        <input
                                                            type="text"
                                                            placeholder="name"
                                                            name="name"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group form-vertical">
                                                    <label>Code</label>
                                                    <div className="form_elements">
                                                        <input
                                                            type="text"
                                                            placeholder="code"
                                                            name="code"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group form-vertical">
                                                    <label>Description</label>
                                                    <div className="form_elements">
                                                        <textarea
                                                            name="description"
                                                            id=""
                                                            placeholder="description"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="full_width">
                                    <div className="form_section_heading">
                                        <h4>Class Routine Time</h4>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="class_days"
                                        defaultValue={days.length}
                                    />
                                    <div className="multi_inputs">
                                        <div className="multi_input_group">
                                            {days.map((i, index) => (
                                                <div>
                                                    <div
                                                        style={{
                                                            color: 'white',
                                                        }}
                                                        className="mb-2"
                                                    >
                                                        Day no. {index + 1}
                                                    </div>
                                                    <div className="d-flex">
                                                        <div className="form-group form-vertical">
                                                            <label>Day</label>
                                                            <div className="form_elements">
                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    placeholder="date"
                                                                    name="day_name"
                                                                    defaultValue={
                                                                        i
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group form-vertical">
                                                            {/* <label>Day No</label> */}
                                                            <div className="form_elements">
                                                                <input
                                                                    type="hidden"
                                                                    // readOnly
                                                                    placeholder="date"
                                                                    name="day_no"
                                                                    defaultValue={
                                                                        index
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group form-vertical">
                                                            <label>
                                                                Start Time
                                                            </label>
                                                            <div className="form_elements">
                                                                <input
                                                                    type="time"
                                                                    placeholder="start time"
                                                                    name="start_time"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group form-vertical">
                                                            <label>
                                                                End Time
                                                            </label>
                                                            <div className="form_elements">
                                                                <input
                                                                    type="time"
                                                                    placeholder="end time"
                                                                    name="end_time"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group form-vertical">
                                                            <label>
                                                                Teacher
                                                            </label>
                                                            <div className="form_elements">
                                                                <select
                                                                    name="branch_teacher_id"
                                                                    id=""
                                                                    className="teacher"
                                                                >
                                                                    <option value="">
                                                                        Select
                                                                        Teacher
                                                                    </option>
                                                                    {state
                                                                        ?.teachers
                                                                        ?.length &&
                                                                        state.teachers?.map(
                                                                            (i: {
                                                                                [
                                                                                    key: string
                                                                                ]: any;
                                                                            }) => {
                                                                                return (
                                                                                    <option
                                                                                        value={
                                                                                            i.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            i
                                                                                                .user_teacher
                                                                                                ?.name
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            },
                                                                        )}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="form-group form-vertical">
                                                            <label>Room</label>
                                                            <div className="form_elements">
                                                                <select
                                                                    name="room"
                                                                    id=""
                                                                    className="room"
                                                                >
                                                                    <option value="">
                                                                        Select
                                                                        Room
                                                                    </option>
                                                                    {state
                                                                        ?.rooms
                                                                        ?.length &&
                                                                        state.rooms?.map(
                                                                            (i: {
                                                                                [
                                                                                    key: string
                                                                                ]: any;
                                                                            }) => {
                                                                                return (
                                                                                    <option
                                                                                        value={
                                                                                            i.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            i.room_name
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            },
                                                                        )}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="full_width">
                                    <div className="form_section_heading">
                                        <h4>Teacher Part</h4>
                                    </div>
                                    <div className="multi_inputs">
                                        <div
                                            // key={i}
                                            className="multi_input_group"
                                        >
                                            <div className="d-flex">
                                                <div className="form-group form-vertical">
                                                    <label>Description</label>
                                                    <div className="form_elements">
                                                        <input
                                                            type="text"
                                                            placeholder="teacher description"
                                                            name="teacher_description"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group student_submit form-horizontal">
                                {/* <label></label> */}
                                <div className="form_elementss">
                                    <button
                                        // onClick={handle_submit}
                                        className="btn btn_1"
                                    >
                                        submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default Create;
