import React, { useState, useEffect, useRef } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import BackButton from '../../course_materials/pages/BackButton';
import InputImage, { InputImageRef } from './InputImage';
export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState('');
    const [leaveTypes, setLeaveType] = useState<any>();
    const inputImageRef = useRef<InputImageRef>(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/v1/leave-types/all-type');
            setLeaveType(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [days, setDays] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

    // Auto-calculate days
    useEffect(() => {
        const start = moment(startDate);
        const end = moment(endDate);
        const today = moment().startOf('day');

        if (start.isBefore(today)) {
            setErrorMessage('Start date cannot be before today.');
            setDays(0);
            return;
        }
        if (end.isBefore(start)) {
            setErrorMessage2('End date cannot be before start date.');
            setDays(0);
            return;
        }

        const diffDays = end.diff(start, 'days') + 1;
        setDays(diffDays);
        setErrorMessage('');
        setErrorMessage2('');
    }, [startDate, endDate]);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleDaysChange = (e) => {
        setDays(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        try {
            const response = await axios.post(
                '/api/v1/leave-applications/student-store',
                formData,
            );
            setData('Form submitted successfully!');
            (window as any).toaster('submitted');
        } catch (error) {
            console.log('data', error.msg);
        }
    };

    return (
        <div className="admin_dashboard">
            <BackButton></BackButton>
            <div className="content_body">
                <form onSubmit={handleSubmit} className="form_600 mx-auto pt-3">
                    <div className="form-group form-horizontal">
                        <label>
                            Leave Type <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <select name="leave_type" id="">
                                <option value="">Select leave type</option>
                                {leaveTypes?.length &&
                                    leaveTypes?.map(
                                        (i: { [key: string]: any }) => {
                                            return (
                                                <option value={i.id}>
                                                    {i.title}
                                                </option>
                                            );
                                        },
                                    )}
                            </select>
                        </div>
                    </div>
                    {/* Start Date */}
                    <div className="form-group form-horizontal">
                        <label>
                            Start Date <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                name="start_date"
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
                    </div>

                    {/* End Date */}
                    <div className="form-group form-horizontal">
                        <label>
                            End Date <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                name="end_date"
                            />
                            {errorMessage2 && (
                                <div
                                    style={{
                                        color: 'red',
                                        marginTop: '5px',
                                    }}
                                >
                                    {errorMessage2}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total Days */}
                    <div className="form-group form-horizontal">
                        <label>
                            Total Days <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="number"
                                value={days}
                                readOnly
                                onChange={handleDaysChange}
                                name="days"
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>
                            Attchment <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            {/* <input
                                type="file"
                                accept="image/*"
                                name="attachments"
                            /> */}
                            <InputImage
                                ref={inputImageRef}
                                label=""
                                name="attachments"
                                defalut_preview=""
                            />
                        </div>
                    </div>
                    <div className="form-group student_submit form-horizontal">
                        <label></label>
                        <div className="form_elements">
                            <button
                                type="submit"
                                className={`btn btn-outline-info btn_1 ${errorMessage || errorMessage2 ? 'btn_error' : ''}`}
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

export default Create;
