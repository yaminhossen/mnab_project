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
import { details } from './config/store/async_actions/details';
import { update } from './config/store/async_actions/update';
import moment from 'moment/moment';
import axios from 'axios';
export interface Props {}

const Edit: React.FC<Props> = (props: Props) => {
    const teacherref = useRef<HTMLSelectElement>(null);
    const [sevenDayRoutines, setsevenDayRoutines] = useState<any>([]);
    const [teacher, setTeachers] = useState<any>(Number);
    const [selectedClass, setSelectedClass] = useState<any>(Number);
    const [selectedSection, setSelectedSection] = useState<any>(Number);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(Number);
    const [selectedRoom, setSelectedRoom] = useState<any>(Number);
    const [selectedRTeacher, setSelectedRTeacher] = useState<any>(Number);
    const [selectedRRoom, setSelectedRRoom] = useState<any>(Number);
    const roomref = useRef<HTMLSelectElement>(null);
    const [room, setRooms] = useState<any>(Number);
    const [sections, setSections] = useState<any>([]);
    const [error, setError] = useState(null);
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    async function initdependancy() {
        await dispatch(storeSlice.actions.set_item({}));
        await dispatch(details({ id: params.id }) as any);
        await dispatch(classes({}) as any);
        // await dispatch(sections({}) as any);
        // await fetchData();
        await dispatch(teachers({}) as any);
        await dispatch(rooms({}) as any);
    }

    useEffect(() => {
        initdependancy();
    }, []);
    async function handle_submit(e) {
        e.preventDefault();
        let response = await dispatch(update(new FormData(e.target)) as any);
    }
    console.log('class section', selectedClass);

    let days = [
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
    ];

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
    useEffect(() => {
        if (state.item.branch_class_id && !selectedClass) {
            setSelectedClass(state.item.branch_class_id);
        }
        if (state.item.branch_class_section_id && !selectedSection) {
            setSelectedSection(state.item.branch_class_section_id);
        }
        if (state.item.subject_teacher?.branch_teacher_id && !selectedTeacher) {
            setSelectedTeacher(state.item.subject_teacher?.branch_teacher_id);
        }
        if (state.item.subject_teacher?.branch_class_room_id && !selectedRoom) {
            setSelectedRoom(state.item.subject_teacher?.branch_class_room_id);
        }
    }, [state.item]);

    const handleTeacherChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
        index,
    ) => {
        // let temp = [...sevenDayRoutines];
        // let temp: any[] = Array.from(sevenDayRoutines);
        const temp: any[] = JSON.parse(JSON.stringify(sevenDayRoutines));
        console.log('tempindex1', temp[index]);
        console.log('tempindex2', temp);
        temp[index].branch_teacher_id = event.target.value;
        console.log('tempindex3', event.target.value);
        setsevenDayRoutines(temp);
    };

    const handleRoomChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
        index,
    ) => {
        // let temp = [...sevenDayRoutines];
        // let temp: any[] = Array.from(sevenDayRoutines);
        const temp: any[] = JSON.parse(JSON.stringify(sevenDayRoutines));
        console.log('tempindex1', temp[index]);
        console.log('tempindex2', temp);
        temp[index].branch_class_room_id = event.target.value;
        console.log('tempindex3', event.target.value);
        setsevenDayRoutines(temp);
    };
    const fetchData = async (classId: string) => {
        try {
            const response = await axios.get(
                `/api/v1/branch-class-sections/class-wise/${classId}`,
            );
            setSections(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        if (selectedClass) {
            fetchData(selectedClass);
        }
    }, [selectedClass]);
    const now = moment();
    const oneHourLater = moment().add(1, 'hour');
    const [schedule, setSchedule] = useState(
        days.map(() => ({
            start_time: now.format('HH:mm'),
            end_time: oneHourLater.format('HH:mm'),
            error: '',
        })),
    );
    const initializeSchedule = (sourceData) => {
        return sourceData?.map((day) => ({
            start_time: day.start_time || now.format('HH:mm'),
            end_time: day.end_time || oneHourLater.format('HH:mm'),
            error: '',
        }));
    };
    useEffect(() => {
        setsevenDayRoutines(state.item.routine_days);
        setSchedule(initializeSchedule(state.item.routine_days));
    }, [state.item]);
    // console.log('sevenDayRoutines', sevenDayRoutines);

    const handleTimeChange = (index, field, value) => {
        const newSchedule = [...schedule];
        newSchedule[index][field] = value;

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
    const hasErrors = schedule?.some((day) => day.error);
    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.edit_page_title}></Header>

                    {Object.keys(state.item).length && (
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

                                        <input
                                            type="hidden"
                                            name="id"
                                            defaultValue={state.item.id}
                                        />
                                        <div className="multi_inputs">
                                            <div className="multi_input_group">
                                                <div className="d-flex">
                                                    <div className="form-group form-vertical">
                                                        <label>
                                                            Class
                                                            {/* <div>
                                                                {
                                                                    state.item
                                                                        .branch_class_id
                                                                }
                                                            </div> */}
                                                        </label>
                                                        <div className="form_elements">
                                                            {Object.keys(
                                                                state.item,
                                                            ).length && (
                                                                <select
                                                                    name="branch_class_id"
                                                                    id=""
                                                                    value={
                                                                        selectedClass
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        setSelectedClass(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        );
                                                                    }}
                                                                >
                                                                <option value="">
                                                                    Select
                                                                    Class
                                                                </option>
                                                                    {state
                                                                        ?.classes
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
                                                            )}
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
                                                                    id=""
                                                                    value={
                                                                        selectedSection
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        setSelectedSection(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        );
                                                                    }}
                                                                >
                                                                <option value="">
                                                                    Select
                                                                    Section
                                                                </option>
                                                                    {sections?.map(
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
                                                                name="user_teacher_id"
                                                                id=""
                                                                value={
                                                                    selectedTeacher
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    setSelectedTeacher(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                }}
                                                            >
                                                                <option value="">
                                                                    Select
                                                                    teacher
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
                                                                value={
                                                                    selectedRoom
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    setSelectedRoom(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                }}
                                                            >
                                                                <option value="">
                                                                    Select
                                                                    room
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
                                                                defaultValue={
                                                                    state.item
                                                                        .name
                                                                }
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
                                                                defaultValue={
                                                                    state.item
                                                                        .code
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <div className="form-group form-vertical">
                                                        <label>Level</label>
                                                        <div className="form_elements">
                                                            <input
                                                                type="text"
                                                                placeholder="level"
                                                                name="level"
                                                                defaultValue={
                                                                    state.item
                                                                        .level
                                                                }
                                                            />
                                                        </div>
                                                    </div> */}
                                                    <div className="form-group form-vertical">
                                                        <label>
                                                            Description
                                                        </label>
                                                        <div className="form_elements">
                                                            <textarea
                                                                name="description"
                                                                id=""
                                                                placeholder="description"
                                                                defaultValue={
                                                                    state.item
                                                                        .description
                                                                }
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
                                                {/* {state.item.routine_days
                                                    .length &&
                                                    state.item.routine_days.map(
                                                        (i, index) => ( */}
                                                {sevenDayRoutines?.length &&
                                                    sevenDayRoutines.map(
                                                        (i, index) => (
                                                            <div>
                                                                <div
                                                                    style={{
                                                                        color: 'white',
                                                                    }}
                                                                    className="mb-2"
                                                                >
                                                                    Day no.{' '}
                                                                    {index + 1}
                                                                </div>
                                                                <div className="d-flex">
                                                                    <div className="form-group form-vertical">
                                                                        <label>
                                                                            Day
                                                                        </label>
                                                                        <div className="form_elements">
                                                                            <div>
                                                                                <input
                                                                                    className={`${i.day_name}`}
                                                                                    type="text"
                                                                                    readOnly
                                                                                    placeholder="date"
                                                                                    name="day_name"
                                                                                    defaultValue={
                                                                                        i.day_name
                                                                                    }
                                                                                />
                                                                            </div>
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
                                                                            Start
                                                                            Time
                                                                        </label>
                                                                        <div className="form_elements">
                                                                            {i.day_name !==
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
                                                                            End
                                                                            Time
                                                                        </label>
                                                                        <div className="form_elements">
                                                                            {i.day_name !==
                                                                            'friday' ? (
                                                                                <>
                                                                                        <input
                                                                                            type="time"
                                                                                            placeholder="Start time"
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
                                                                            Teacher
                                                                        </label>
                                                                        {/* <div className="form_elements">
                                                                            {i.day_name !==
                                                                'friday' ? (
                                                                            {state
                                                                                .item
                                                                                .routine_days
                                                                                .length && (
                                                                                <select
                                                                                    name="branch_teacher_id"
                                                                                    id=""
                                                                                    className="teacher"
                                                                                    value={
                                                                                        i.branch_teacher_id
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) => {
                                                                                        handleTeacherChange(
                                                                                            e,
                                                                                            index,
                                                                                        );
                                                                                    }}
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
                                                                                </select>
                                                                            )}
                                                                ) : (
                                                                    <input
                                                                        name="start_time"
                                                                        type="text"
                                                                        placeholder="This is Friday"
                                                                        readOnly
                                                                    />
                                                                )}
                                                                        </div> */}
                                                                        <div className="form_elements">
                                                                            {i.day_name !==
                                                                            'friday' ? (
                                                                                Array.isArray(
                                                                                    state
                                                                                        ?.item
                                                                                        ?.routine_days,
                                                                                ) &&
                                                                                state
                                                                                    .item
                                                                                    .routine_days
                                                                                    .length >
                                                                                    0 ? (
                                                                                    <select
                                                                                        name="branch_teacher_id"
                                                                                        className="teacher"
                                                                                        value={
                                                                                            i.branch_teacher_id
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            handleTeacherChange(
                                                                                                e,
                                                                                                index,
                                                                                            )
                                                                                        }
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
                                                                                        placeholder="No routine days found"
                                                                                        readOnly
                                                                                    />
                                                                                )
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
                                                                            Room
                                                                        </label>
                                                                        <div className="form_elements">
                                                                            <div className="form_elements">
                                                                                {i.day_name !==
                                                                                'friday' ? (
                                                                                    Array.isArray(
                                                                                        state
                                                                                            ?.item
                                                                                            ?.routine_days,
                                                                                    ) &&
                                                                                    state
                                                                                        .item
                                                                                        .routine_days
                                                                                        .length >
                                                                                        0 ? (
                                                                                        <select
                                                                                            name="room"
                                                                                            className="room"
                                                                                            value={
                                                                                                i.branch_class_room_id
                                                                                            }
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) =>
                                                                                                handleRoomChange(
                                                                                                    e,
                                                                                                    index,
                                                                                                )
                                                                                            }
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
                                                                                            placeholder="No routine days found"
                                                                                            readOnly
                                                                                        />
                                                                                    )
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
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="full_width">
                                        <div className="form_section_heading">
                                            <h4>Teacher</h4>
                                        </div>
                                        <div className="multi_inputs">
                                            <div
                                                // key={i}
                                                className="multi_input_group"
                                            >
                                                <div className="d-flex">
                                                    <div className="form-group form-vertical">
                                                        <label>
                                                            Description
                                                        </label>
                                                        <div className="form_elements">
                                                            <input
                                                                type="text"
                                                                placeholder="teacher description"
                                                                name="teacher_description"
                                                                defaultValue={
                                                                    state.item
                                                                        .subject_teacher
                                                                        ?.description
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="form-group student_submit form-horizontal">
                                    {/* <label></label> */}
                                    <div className="form_elementss">
                                        <button
                                            // onClick={handle_submit}
                                            className={`btn btn_1 ${hasErrors ? 'btn_error' : ''}`}
                                            disabled={!!hasErrors}
                                        >
                                            update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default Edit;
