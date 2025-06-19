import React, { useEffect, useRef, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { store } from './config/store/async_actions/store';
import DropDown from './components/dropdown/DropDown';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { initialState } from './config/store/inital_state';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import storeSlice from './config/store';
import { classes } from './config/store/async_actions/classes';
import { exams } from './config/store/async_actions/all_exams';
import { rooms } from './config/store/async_actions/rooms';
export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState<any>([]);
    const search_input = useRef<HTMLSelectElement>(null);
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
                `/api/v1/branch-class-subjects/class-wise-subject/1`,
            );
            setSubjects(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    async function initdependancy() {
        await dispatch(storeSlice.actions.set_item({}));
        await dispatch(classes({}) as any);
        await dispatch(exams({}) as any);
        await dispatch(rooms({}) as any);
        await fetchData();
    }

    useEffect(() => {
        initdependancy();
    }, []);
    console.log('state', state);
    const handleChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        let id = event.target.value;
        try {
            const response = await axios.get(
                `/api/v1/branch-class-subjects/class-wise-subject/${id}`,
            );
            setSubjects(response.data.data);
        } catch (error) {
            setError(error);
        }
        console.log('Selected value:', event.target.value);
    };
    const now = moment();
    const oneHourLater = moment().add(1, 'hour');
    const [formData, setFormData] = useState({
        start_time: now.format('HH:mm'),
        end_time: oneHourLater.format('HH:mm'),
        date: moment().format('YYYY-MM-DD'),
    });

    const [errorMessageStartTime, setErrorMessageStartTime] = useState('');
    const [errorMessageEndTime, setErrorMessageEndTime] = useState('');
    const [errorMessageDate, setErrorMessageDate] = useState('');

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Real-time validation
    useEffect(() => {
        // Start Time
        if (!formData.start_time) {
            setErrorMessageStartTime('Start time is required');
        } else if (
            formData.end_time &&
            moment(formData.start_time, 'HH:mm').isAfter(
                moment(formData.end_time, 'HH:mm'),
            )
        ) {
            setErrorMessageStartTime('Start time cannot be after end time');
        } else {
            setErrorMessageStartTime('');
        }

        // End Time
        if (!formData.end_time) {
            setErrorMessageEndTime('End time is required');
        } else if (
            formData.start_time &&
            moment(formData.end_time, 'HH:mm').isBefore(
                moment(formData.start_time, 'HH:mm'),
            )
        ) {
            setErrorMessageEndTime(
                'End time cannot be earlier than start time',
            );
        } else {
            setErrorMessageEndTime('');
        }

        // Date
        if (!formData.date) {
            setErrorMessageDate('Date is required');
        } else if (
            moment(formData.date).isBefore(moment().format('YYYY-MM-DD'))
        ) {
            setErrorMessageDate('Date cannot be in the past');
        } else {
            setErrorMessageDate('');
        }
    }, [formData]);

    const hasError =
        errorMessageStartTime || errorMessageEndTime || errorMessageDate;

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.create_page_title}></Header>
                    <div className="content_body custom_scroll">
                        <form
                            onSubmit={(e) => handle_submit(e)}
                            className="form_600 mx-auto pt-3"
                        >
                            {/* <div className="form_section_heading">
                                <h2 className=""> Major Information</h2>
                            </div> */}
                            <div className="">
                                <div className="form-group form-horizontal">
                                    <label>
                                        Branch Class{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select
                                            name="class_id"
                                            id=""
                                            onChange={handleChange}
                                        >
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
                                <div className="form-group form-horizontal">
                                    <label>
                                        Branch Class subject{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        {subjects.length && (
                                            <select name="subject_id" id="">
                                                {/* <option value={data.class_id}></option> */}
                                                {subjects.map((i, index) => {
                                                    return (
                                                        <option value={i.id}>
                                                            {i.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Exam{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select
                                            name="exam_id"
                                            id=""
                                            // onChange={handleChange}
                                        >
                                            {state?.exams?.length &&
                                                state.exams?.map(
                                                    (i: {
                                                        [key: string]: any;
                                                    }) => {
                                                        return (
                                                            <option
                                                                value={i.id}
                                                            >
                                                                {i.title}
                                                            </option>
                                                        );
                                                    },
                                                )}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Room{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select
                                            name="room_id"
                                            id=""
                                            // onChange={handleChange}
                                        >
                                            {state?.rooms?.length &&
                                                state.rooms?.map(
                                                    (i: {
                                                        [key: string]: any;
                                                    }) => {
                                                        return (
                                                            <option
                                                                value={i.id}
                                                            >
                                                                {i.room_name}
                                                            </option>
                                                        );
                                                    },
                                                )}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Start Time{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="time"
                                            placeholder="start time"
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={handleChange2}
                                        />
                                        {errorMessageStartTime && (
                                            <div style={{ color: 'red' }}>
                                                {errorMessageStartTime}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        End Time{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="time"
                                            placeholder="end time"
                                            name="end_time"
                                            value={formData.end_time}
                                            onChange={handleChange2}
                                        />
                                        {errorMessageEndTime && (
                                            <div style={{ color: 'red' }}>
                                                {errorMessageEndTime}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Date{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange2}
                                        />
                                        {errorMessageDate && (
                                            <div style={{ color: 'red' }}>
                                                {errorMessageDate}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group student_submit form-horizontal">
                                {/* <label></label> */}
                                <div className="form_elementss">
                                    {/* <button className="btn btn_1">
                                        submit
                                    </button> */}
                                    {/* {!hasError && (
                                        <button className="btn btn_1">
                                            Update
                                        </button>
                                    )} */}
                                    <button
                                        // className="d_btn d_btn_1"
                                        className={`btn btn_1 ${hasError ? 'btn_error' : ''}`}
                                        disabled={!!hasError}
                                    >
                                        update
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
