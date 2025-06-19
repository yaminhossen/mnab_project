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
export interface Props {}

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();
    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);

    const [startDate, setStartDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

    const [endDate, setEndDate] = useState('');
    const [days, setDays] = useState(0);
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
                                    defaultValue={state.item?.id}
                                />
                                <input
                                    type="hidden"
                                    name="leave_type_id"
                                    defaultValue={state.item?.leave_type_id}
                                />
                                {state.item.student && (
                                    <div className="form-group form-horizontal">
                                        <label>Student</label>
                                        <div className="form_elements">
                                            <input
                                                type="text"
                                                name="student"
                                                readOnly
                                                placeholder="notice title"
                                                defaultValue={
                                                    state.item?.student?.name
                                                }
                                            />
                                            <input
                                                type="hidden"
                                                name="student_id"
                                                placeholder="notice title"
                                                defaultValue={
                                                    state.item.branch_student_id
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                                {state.item.staff && (
                                    <div className="form-group form-horizontal">
                                        <label>Staff</label>
                                        <div className="form_elements">
                                            <input
                                                type="text"
                                                name="staff"
                                                readOnly
                                                placeholder="notice title"
                                                defaultValue={
                                                    state.item?.staff?.name
                                                }
                                            />
                                            <input
                                                type="hidden"
                                                name="staff_id"
                                                placeholder="notice title"
                                                defaultValue={
                                                    state.item.branch_staff_id
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                                {state.item.teacher && (
                                    <div className="form-group form-horizontal">
                                        <label>Teacher</label>
                                        <div className="form_elements">
                                            <input
                                                type="text"
                                                name="teacher"
                                                readOnly
                                                placeholder="notice title"
                                                defaultValue={
                                                    state.item?.teacher?.name
                                                }
                                            />
                                            <input
                                                type="hidden"
                                                name="teacher_id"
                                                placeholder="notice title"
                                                defaultValue={
                                                    state.item.branch_teacher_id
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="form-group form-horizontal">
                                    <label>Leave Type</label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            name="leave_type"
                                            readOnly
                                            defaultValue={
                                                state.item.leave_type?.title
                                            }
                                        ></input>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Attachment</label>
                                    <div className="form_elements">
                                        <a
                                            target="blank"
                                            href={
                                                state.item?.attachments ||
                                                undefined
                                            }
                                        >
                                            <img
                                                src={state.item?.attachments}
                                                height={100}
                                                alt="attachment"
                                            />
                                        </a>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Start Date</label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            readOnly
                                            name="start_date"
                                            placeholder="Start date"
                                            defaultValue={moment(
                                                state.item.start_date,
                                            ).format('YYYY-MM-DD')}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>End Date</label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            name="end_date"
                                            readOnly
                                            placeholder="End Date"
                                            defaultValue={moment(
                                                state.item.end_date,
                                            ).format('YYYY-MM-DD')}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Total Days</label>
                                    <div className="form_elements">
                                        <input
                                            type="number"
                                            name="total_days"
                                            readOnly
                                            placeholder="Toatal days"
                                            defaultValue={state.item.total_days}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Permission{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select name="leave_status" id="">
                                            <option value="">
                                                Select Option
                                            </option>
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="approved">
                                                Approved
                                            </option>
                                            <option value="rejected">
                                                Reject
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Approved Start Date{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            name="approved_start_date"
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
                                        Approved End Date{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                            name="approved_end_date"
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
                                    <label>Approved Total Days</label>
                                    <div className="form_elements">
                                        <input
                                            type="number"
                                            name="approved_days"
                                            placeholder="Approved days"
                                            value={days}
                                            onChange={handleDaysChange}
                                            min="1"
                                            readOnly
                                            // value={
                                            //     aptotalDays
                                            //         ? aptotalDays
                                            //         : state.item?.total_days
                                            // }
                                        />
                                    </div>
                                </div>
                                {/* <div className="form-group form-horizontal">
                                    <label>Pre Approved Days</label>
                                    <div className="form_elements">
                                        <input
                                            type="number"
                                            name="approved_days"
                                            placeholder="Approved days"
                                            defaultValue={
                                                state.item.approved_days
                                            }
                                        />
                                    </div>
                                </div> */}
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
