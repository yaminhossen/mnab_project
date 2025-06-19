import React, { useState, useEffect, useRef } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import BackButton from './BackButton';
import InputImage, { InputImageRef } from './InputImage';
export interface Props {}

const CreateAssignment: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<any>([]);
    const [classes, setClasses] = useState<any>([]);
    const [subjects, setSubjects] = useState<any>([]);
    // const [categories, setCategories] = useState<any>([]);
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const inputImageRef = useRef<InputImageRef>(null);

    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();

    const fetchClasses = async () => {
        try {
            const response = await axios.get(
                `/api/v1/branch-class-subjects/class-wise-teacher`,
            );
            setClasses(response.data.data);
        } catch (error) {
            setError(error);
        }
    };
    // const fetchCategories = async () => {
    //     try {
    //         const response = await axios.get(
    //             `/api/v1/assignment-categories/all-categories`,
    //         );
    //         setCategories(response.data.data);
    //     } catch (error) {
    //         setError(error);
    //     }
    // };

    useEffect(() => {
        // fetchCategories();
        fetchClasses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        console.log('formData', formData);
        try {
            const response = await axios.post(
                '/api/v1/assignments/store',
                formData,
            );
            e.target.reset();
            (window as any).toaster('Assignment Created');
            // here use toastar
            // setData(response.data.data.data);
        } catch (error) {
            setError(error);
        }
    };

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
        console.log('Selected value:', event.target.value);
    };
    console.log('Selected dataaa:', subjects);

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
    return (
        <div className="admin_dashboard">
            <h3>Create</h3>
            <BackButton></BackButton>
            <div className="content_body">
                <form onSubmit={handleSubmit} className="form_600 mx-auto pt-3">
                    <div className="form-group form-horizontal">
                        <label>
                            Class <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <select
                                name="class"
                                id=""
                                value={data.class_id}
                                onChange={handleChange}
                            >
                                <option value="">Select class</option>
                                {classes.map((i, index) => {
                                    return (
                                        <option value={i.id}>{i.name}</option>
                                    );
                                })}
                            </select>
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
                            <select name="subject" id="">
                                <option value="">Select subject</option>
                                {subjects.map((i, index) => {
                                    return (
                                        <option value={i.id}>{i.name}</option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    {/* <div className="form-group form-horizontal">
                        <label>Category</label>
                        <div className="form_elements">
                            <select name="assignment_categories_id" id="">
                                <option
                                    value={data.assignment_categories_id}
                                ></option>
                                {categories.map((i, index) => {
                                    return (
                                        <option value={i.id}>{i.title}</option>
                                    );
                                })}
                            </select>
                        </div>
                    </div> */}
                    <div className="form-group form-horizontal">
                        <label>
                            Title <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="text"
                                placeholder="title"
                                name="title"
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>Description</label>
                        <div className="form_elements">
                            <textarea
                                placeholder="description"
                                name="description"
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>
                            Attachment <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            {/* <input type="file" name="attachment" /> */}
                            <InputImage
                                ref={inputImageRef}
                                label=""
                                name="attachment"
                                defalut_preview=""
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>
                            Mark <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input type="number" name="mark" />
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
                                type="submit"
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

export default CreateAssignment;
