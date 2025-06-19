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
import moment from 'moment/moment';
export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const teacherref = useRef<HTMLSelectElement>(null);
    const [teacher, setTeachers] = useState<any>(Number);
    const roomref = useRef<HTMLSelectElement>(null);
    const [room, setRooms] = useState<any>(Number);
    const [error, setError] = useState(null);
    const [sections, setSections] = useState<any>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/api/v1/branch-class-sections/class-wise/1`,
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
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
    ];
    const now = moment();
    const oneHourLater = moment().add(1, 'hour');
    const [schedule, setSchedule] = useState(
        days.map(() => ({
            start_time: now.format('HH:mm'),
            end_time: oneHourLater.format('HH:mm'),
            error: '',
        })),
    );
    const handleTimeChange = (index, field, value) => {
        const newSchedule = [...schedule];
        newSchedule[index][field] = value;

        // Validation: end time must be after start time
        const { start_time, end_time } = newSchedule[index];

        if (start_time && end_time) {
            const start = moment(start_time, 'HH:mm');
            const end = moment(end_time, 'HH:mm');

            if (end.isBefore(start)) {
                newSchedule[index].error = 'End time must be after start time';
            } else {
                newSchedule[index].error = '';
            }
        } else {
            newSchedule[index].error = '';
        }

        setSchedule(newSchedule);
    };

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

    async function handle_submit(e) {
        e.preventDefault();
        let response = await dispatch(store(new FormData(e.target)) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
        }
    }
    const hasErrors = schedule.some((day) => day.error);

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
                                                            onChange={
                                                                handleChange2
                                                            }
                                                            value={
                                                                selectedClassId
                                                            }
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
                                                    <label>
                                                        Branch class section
                                                    </label>
                                                    <div className="form_elements">
                                                        {sections.length && (
                                                            <select
                                                                name="branch_class_section_id"
                                                                disabled={
                                                                    !selectedClassId ||
                                                                    sections.length ===
                                                                        0
                                                                }
                                                            >
                                                                <option value="">
                                                                    {' '}
                                                                    Select
                                                                    section{' '}
                                                                </option>
                                                                {sections.map(
                                                                    (
                                                                        i,
                                                                        index,
                                                                    ) => {
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
                                                        )}
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
                                                        {/* <div className="form-group form-vertical">
                                                            <label>
                                                                Start Time
                                                            </label>
                                                            <div className="form_elements">
                                                                <input
                                                                    type="time"
                                                                    placeholder="start time"
                                                                    name="start_time"
                                                                    value={
                                                                        schedule[
                                                                            index
                                                                        ]
                                                                            .start_time
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleTimeChange(
                                                                            index,
                                                                            'start_time',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div> */}
                                                        <div className="form-group form-vertical">
                                                            <label>
                                                                Start Time
                                                            </label>
                                                            <div className="form_elements">
                                                                {i !==
                                                                'friday' ? (
                                                                    <>
                                                                        <input
                                                                            type="time"
                                                                            placeholder="Start time"
                                                                            name="start_time"
                                                                            value={
                                                                                schedule[
                                                                                    index
                                                                                ]
                                                                                    ?.start_time ||
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                handleTimeChange(
                                                                                    index,
                                                                                    'start_time',
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                        {schedule[
                                                                            index
                                                                        ]
                                                                            ?.error && (
                                                                            <div
                                                                                style={{
                                                                                    color: 'red',
                                                                                }}
                                                                            >
                                                                                {
                                                                                    schedule[
                                                                                        index
                                                                                    ]
                                                                                        .error
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <input
                                                                        name="start_time"
                                                                        type="text"
                                                                        placeholder="This is Friday"
                                                                        readOnly
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="form-group form-vertical">
                                                            <label>
                                                                End Time
                                                            </label>
                                                            <div className="form_elements">
                                                                {i !==
                                                                'friday' ? (
                                                                    <>
                                                                        <input
                                                                            type="time"
                                                                            placeholder="End time"
                                                                            name="end_time"
                                                                            value={
                                                                                schedule[
                                                                                    index
                                                                                ]
                                                                                    ?.end_time ||
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                handleTimeChange(
                                                                                    index,
                                                                                    'end_time',
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                        {schedule[
                                                                            index
                                                                        ]
                                                                            ?.error && (
                                                                            <div
                                                                                style={{
                                                                                    color: 'red',
                                                                                }}
                                                                            >
                                                                                {
                                                                                    schedule[
                                                                                        index
                                                                                    ]
                                                                                        .error
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <input
                                                                        name="end_time"
                                                                        type="text"
                                                                        placeholder="This is Friday"
                                                                        readOnly
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="form-group form-vertical">
                                                            <label>
                                                                Teacher
                                                            </label>
                                                            {/* <div className="form_elements">
                                                                {
                                                                    i !== 'friday' ? 
                                                                    (<select
                                                                    name="branch_teacher_id"
                                                                    id=""
                                                                    className="teacher"
                                                                >
                                                                    <option value="0">
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
                                                                </select>)
                                                                 : ( <div>
                                                                    <input name="branch_teacher_id" type="text" placeholder='This is Friday' readOnly /> 
                                                                 </div> )
                                                                }
                                                            </div> */}
                                                            <div className="form_elements">
                                                                {i !==
                                                                'friday' ? (
                                                                    <select
                                                                        name="branch_teacher_id"
                                                                        className="teacher"
                                                                    >
                                                                        <option value="0">
                                                                            Select
                                                                            Teacher
                                                                        </option>
                                                                        {Array.isArray(
                                                                            state?.teachers,
                                                                        ) &&
                                                                        state
                                                                            .teachers
                                                                            .length >
                                                                            0 ? (
                                                                            state.teachers.map(
                                                                                (teacher: {
                                                                                    [
                                                                                        key: string
                                                                                    ]: any;
                                                                                }) => (
                                                                                    <option
                                                                                        key={
                                                                                            teacher.id
                                                                                        }
                                                                                        value={
                                                                                            teacher.id
                                                                                        }
                                                                                    >
                                                                                        {teacher
                                                                                            .user_teacher
                                                                                            ?.name ||
                                                                                            'Unnamed'}
                                                                                    </option>
                                                                                ),
                                                                            )
                                                                        ) : (
                                                                            <option
                                                                                disabled
                                                                            >
                                                                                No
                                                                                teachers
                                                                                available
                                                                            </option>
                                                                        )}
                                                                    </select>
                                                                ) : (
                                                                    <input
                                                                        name="branch_teacher_id"
                                                                        type="text"
                                                                        placeholder="This is Friday"
                                                                        readOnly
                                                                        />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="form-group form-vertical">
                                                            <label>Room</label>
                                                            <div className="form_elements">
                                                                {i !==
                                                                'friday' ? (
                                                                    <select
                                                                            name="room"
                                                                        className="room"
                                                                        >
                                                                            <option value="0">
                                                                            Select
                                                                            Room
                                                                            </option>
                                                                            {Array.isArray(
                                                                            state?.rooms,
                                                                        ) &&
                                                                        state
                                                                            .rooms
                                                                            .length >
                                                                            0 ? (
                                                                            state.rooms.map(
                                                                                        (room: {
                                                                                    [
                                                                                        key: string
                                                                                    ]: any;
                                                                                }) => (
                                                                                    <option
                                                                                                key={
                                                                                            room.id
                                                                                                }
                                                                                        value={
                                                                                                    room.id
                                                                                        }
                                                                                            >
                                                                                        {room.room_name ||
                                                                                            'Unnamed Room'}
                                                                                    </option>
                                                                                        ),
                                                                            )
                                                                                ) : (
                                                                            <option
                                                                                        disabled
                                                                            >
                                                                                No
                                                                                rooms
                                                                                available
                                                                                    </option>
                                                                        )}
                                                                        </select>
                                                                ) : (
                                                                    <input
                                                                        name="room"
                                                                        type="text"
                                                                        placeholder="This is Friday"
                                                                        readOnly
                                                                        />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* <div className="form-group form-vertical">
                                                            <label>Room</label>
                                                            <div className="form_elements">
                                                                <select
                                                                    name="room"
                                                                    id=""
                                                                    className="room"
                                                                >
                                                                    <option value="0">
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
                                                        </div> */}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="full_width">
                                    {/* <div className="form_section_heading">
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
                                    </div> */}
                                </div>
                            </div>
                            <div className="form-group student_submit form-horizontal">
                                {/* <label></label> */}
                                <div className="form_elementss">
                                    {/* <button
                                        // onClick={handle_submit}
                                        className="btn btn_1"
                                        // disabled={hasErrors}
                                    >
                                        submit
                                    </button> */}
                                    <button
                                        // className="d_btn d_btn_1"
                                        className={`btn btn_1 ${hasErrors ? 'btn_error' : ''}`}
                                        disabled={!!hasErrors}
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
