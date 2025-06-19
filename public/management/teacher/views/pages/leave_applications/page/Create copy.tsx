import React, { useState, useEffect } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import BackButton from '../../course_materials/pages/BackButton';
export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState('');
    const [leaveTypes, setLeaveType] = useState<any>();

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
    const [totalDays, setTotalDays] = useState(0);

    const calculateDays = (start: string, end: string) => {
        const diff = moment(end).diff(moment(start), 'days');
        setTotalDays(diff >= 0 ? diff : 0);
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        calculateDays(e.target.value, endDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        calculateDays(startDate, e.target.value);
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
                    <div className="form-group form-horizontal">
                        <label>
                            Start Date <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="date"
                                value={startDate}
                                name="start_date"
                                onChange={handleStartDateChange}
                            />
                        </div>
                    </div>

                    <div className="form-group form-horizontal">
                        <label>
                            End Date <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="date"
                                value={endDate}
                                name="end_date"
                                onChange={handleEndDateChange}
                            />
                        </div>
                    </div>

                    <div className="form-group form-horizontal">
                        <label>
                            Total Days <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="number"
                                name="days"
                                value={totalDays + 1}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>
                            Attchment <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <input
                                type="file"
                                accept="image/*"
                                name="attachments"
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label></label>
                        <div className="form_elements">
                            <button className="btn btn-sm btn-outline-info">
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
