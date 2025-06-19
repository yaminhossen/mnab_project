import React, { useState, useEffect, useRef } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import BackButton from './BackButton';
import InputImage, { InputImageRef } from './InputImage';
export interface Props {}

const EditAssignment: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<any>([]);
    const [classes, setClasses] = useState<any>([]);
    const [subjects, setSubjects] = useState<any>([]);
    const selectRef = useRef<HTMLSelectElement>(null);
    const selectRef2 = useRef<HTMLSelectElement>(null);
    const [startDate, setStartDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const inputImageRef = useRef<InputImageRef>(null);
    const { id } = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/v1/assignments/${id}`);
            setData(response.data.data);
        } catch (error) {
            setError(error);
        }
    };
    const fetchClasses = async () => {
        try {
            const response = await axios.get(
                `/api/v1/branch-class-subjects/class-wise-teacher`,
                // `/api/v1/branch-classes/all-class`,
            );
            setClasses(response.data.data);
        } catch (error) {
            setError(error);
        }
    };

    async function init_data() {
        await fetchData();
        await fetchClasses();
    }

    useEffect(() => {
        init_data();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        try {
            const response = await axios.post(
                '/api/v1/assignments/update',
                formData,
            );
            (window as any).toaster('Assignment Updated');
        } catch (error) {
            setError(error);
        }
    };

    const fetchSubjects = async (e) => {
        try {
            const response = await axios.get(
                // `/api/v1/branch-classes/class-wise-subject/${Number(e)}`,
                `/api/v1/branch-classes/class-wise-subject/${e}`,
            );
            setSubjects(response.data.data);
        } catch (error) {
            setError(error);
        }
    };

    // useEffect(() => {
    //     fetchSubjects(data.class_id);
    // }, [classes]);
    useEffect(() => {
        if (data?.class_id && Number(data.class_id) > 0) {
            fetchSubjects(Number(data.class_id));
        }

        setStartDate(moment(data?.deadline).format('YYYY-MM-DD'));
    }, [data?.class_id]);

    const handleChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        let id = event.target.value;
        try {
            const response = await axios.get(
                `/api/v1/branch-classes/class-wise-subject/${id}`,
            );
            setSubjects(response.data.data);
        } catch (error) {
            setError(error);
        }
    };
    useEffect(() => {
        const start = moment(startDate);
        const today = moment().startOf('day');

        if (start.isBefore(today)) {
            setErrorMessage('Date cannot be before today.');
            return;
        }

        setErrorMessage('');
    }, [startDate]);
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    // function get_value(key) {
    //     try {
    //         if (state.item[key]) return state.item[key];
    //         if (state.item?.staff_infos[key])
    //             return state.item?.staff_infos[key];
    //     } catch (error) {
    //         return '';
    //     }
    //     return '';
    // }
    console.log('data atachment', data.attachment);

    return (
        <div className="admin_dashboard">
            <h3>Edit</h3>
            <BackButton></BackButton>
            <div className="content_body">
                <form onSubmit={handleSubmit} className="form_600 mx-auto pt-3">
                    <div className="form-group form-horizontal">
                        <label>
                            Class <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            {classes.length && (
                                <select
                                    name="class"
                                    // defaultValue={data.class_id}
                                    id=""
                                    defaultValue={data?.class_id}
                                    onChange={handleChange}
                                >
                                    {/* <option value={data.class_id}></option> */}
                                    {classes.map((i, index) => {
                                        return (
                                            <option value={i.id}>
                                                {i.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            )}
                            <input
                                type="hidden"
                                defaultValue={data.id}
                                name="id"
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>
                            Subject <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            {subjects.length && (
                                <select
                                    name="subject"
                                    defaultValue={data?.subject_id}
                                    id=""
                                >
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
                            Title <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="text"
                                placeholder="title"
                                name="title"
                                defaultValue={data.title}
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>Description</label>
                        <div className="form_elements">
                            <textarea
                                placeholder="description"
                                name="description"
                                defaultValue={data.description}
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>
                            Attachment <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            {/* {/* <input type="file" name="attachment" /> */}
                            {data?.attachment && (
                                <InputImage
                                    ref={inputImageRef}
                                    label=""
                                    name="attachment"
                                    defalut_preview={data.attachment}
                                />
                            )}
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>
                            Mark <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="number"
                                name="mark"
                                defaultValue={data.mark}
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>
                            Deadline <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                name="deadline"
                            />
                            {errorMessage && (
                                <div
                                    style={{
                                        color: 'red',
                                        marginTop: '5px',
                                    }}
                                >
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                        {/* <div className="form_elements">
                            <input
                                type="date"
                                defaultValue={moment(data?.deadline).format(
                                    'YYYY-MM-DD',
                                )}
                                name="deadline"
                            />
                        </div> */}
                    </div>
                    <div className="form-group student_submit form-horizontal">
                        <label></label>
                        <div className="form_elements">
                            <button
                                className={`btn btn-outline-info btn_1 ${errorMessage ? 'btn_error' : ''}`}
                                disabled={!!errorMessage}
                            >
                                submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAssignment;
