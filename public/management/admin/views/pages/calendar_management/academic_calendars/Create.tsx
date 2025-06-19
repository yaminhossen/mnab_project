import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { store } from './config/store/async_actions/store';
import moment from 'moment/moment';
import storeSlice from './config/store';
import { event_types } from './config/store/async_actions/event_types';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';

export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();

    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [days, setDays] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(event_types({}) as any);
    }, []);

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

    async function handle_submit(e) {
        e.preventDefault();
        if (errorMessage) return; // Block submit if error exists
        let response = await dispatch(store(new FormData(e.target)) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
            setStartDate(moment().format('YYYY-MM-DD'));
            setEndDate(moment().format('YYYY-MM-DD'));
            setDays(1);
        }
    }

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleDaysChange = (e) => {
        setDays(e.target.value);
    };

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.create_page_title}></Header>
                    <div className="content_body custom_scroll">
                        <form
                            onSubmit={handle_submit}
                            className="form_600 mx-auto pt-3"
                        >
                            <div className="">
                                <div className="form-group form-horizontal">
                                    <label>
                                        Title{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input type="text" name="event_name" />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Description{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <textarea  name="description" />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Event Type{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select name="event_type_id" required>
                                            {state?.event_types?.length &&
                                                state?.event_types.map(
                                                    (i: {
                                                        [key: string]: any;
                                                    }) => (
                                                        <option
                                                            key={i.id}
                                                            value={i.id}
                                                        >
                                                            {i.title}
                                                        </option>
                                                    ),
                                                )}
                                        </select>
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div className="form-group form-horizontal">
                                    <label>
                                        Start Date{' '}
                                        <span className="valid_star">*</span>
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
                                        End Date{' '}
                                        <span className="valid_star">*</span>
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
                                        Total Days{' '}
                                        <span className="valid_star">*</span>
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

                                {/* Error Message */}
                                {/* {errorMessage && (
                                    <div className="form-group form-horizontal">
                                        <div className="form_elements">
                                            <div className="error_message">
                                                {errorMessage}
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                            </div>

                            {/* Submit Button */}
                            <div className="form-group student_submit form-horizontal">
                                {/* <label></label> */}
                                <div className="form_elementss">
                                    <button
                                        type="submit"
                                        className={`btn btn_1 ${errorMessage || errorMessage2 ? 'btn_error' : ''}`}
                                        disabled={!!errorMessage}
                                    >
                                        Submit
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
