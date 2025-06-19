import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { useParams } from 'react-router-dom';
import storeSlice from './config/store';
import { update } from './config/store/async_actions/update';
import moment from 'moment/moment';
import { event_types } from './config/store/async_actions/event_types';
export interface Props {}

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    const [startDate, setStartDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

    const [endDate, setEndDate] = useState('');
    const [days, setDays] = useState(0);

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
        dispatch(event_types({}) as any);
    }, []);

    // After data loaded, set the dates
    useEffect(() => {
        if (state.item && Object.keys(state.item).length) {
            setStartDate(moment(state.item.start_date).format('YYYY-MM-DD'));
            setEndDate(moment(state.item.end_date).format('YYYY-MM-DD'));
            setDays(state.item.days);
        }
    }, [state.item]);
    useEffect(() => {
        const start = moment(startDate);
        const end = moment(endDate);
        const today = moment().startOf('day');

        if (start.isBefore(today)) {
            setErrorMessage('Start date cannot be before today.');
            setErrorMessage2('');
            setDays(0);
            return;
        }

        if (end.isBefore(start)) {
            setErrorMessage('');
            setErrorMessage2('End date cannot be before start date.');
            setDays(0);
            return;
        }

        const diffDays = end.diff(start, 'days') + 1;
        setDays(diffDays);
        setErrorMessage('');
        setErrorMessage2('');
    }, [startDate, endDate]);

    // // Auto-calculate days when dates change
    // useEffect(() => {
    //     if (startDate && endDate) {
    //         const start = moment(startDate);
    //         const end = moment(endDate);
    //         const diffDays = end.diff(start, 'days') + 1;
    //         if (diffDays > 0) {
    //             setDays(diffDays);
    //         } else {
    //             setDays(0);
    //         }
    //     }
    // }, [startDate, endDate]);

    async function handle_submit(e) {
        e.preventDefault();
        let response = await dispatch(update(new FormData(e.target)) as any);
    }

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleDaysChange = (e) => {
        setDays(Number(e.target.value));
    };

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.edit_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">
                            <form
                                onSubmit={(e) => handle_submit(e)}
                                className="form_600 mx-auto pt-3"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    defaultValue={state.item.id}
                                />
                                <div className="form-group form-horizontal">
                                    <label>
                                        Name{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="event_name"
                                            name="event_name"
                                            defaultValue={state.item.event_name}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Description{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <textarea
                                            name="description"
                                            defaultValue={
                                                state.item.description
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Event Type{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select
                                            name="event_type_id"
                                            defaultValue={
                                                state.item.event_type_id
                                            }
                                            id=""
                                        >
                                            {state?.event_types?.length &&
                                                state?.event_types.map(
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

                                <div className="form-group form-horizontal">
                                    <label>
                                        Days{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="number"
                                            readOnly
                                            value={days}
                                            onChange={handleDaysChange}
                                            name="days"
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div className="form-group student_submit form-horizontal">
                                    {/* <label></label> */}
                                    <div className="form_elementss">
                                        <button
                                            // className="d_btn d_btn_1"
                                            className={`btn btn_1 ${errorMessage || errorMessage2 ? 'btn_error' : ''}`}
                                            disabled={!!errorMessage}
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
