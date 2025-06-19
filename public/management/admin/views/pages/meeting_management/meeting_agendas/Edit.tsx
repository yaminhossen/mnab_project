import React, { useEffect, useRef, useState } from 'react';
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
import { meeting_all } from './config/store/async_actions/meeting_all';
import moment from 'moment/moment';
export interface Props {}

const Edit: React.FC<Props> = (props: Props) => {
    const meetingId = useRef<HTMLSelectElement>(null);
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    const [startDate, setStartDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [meetingType, setMeetingType] = useState('');

    // useEffect(() => {
    //     dispatch(storeSlice.actions.set_item({}));
    //     dispatch(details({ id: params.id }) as any);
    //     dispatch(meeting_all({}) as any);
    //     dispatch(meeting_all({}) as any);
    // }, []);

    async function initdependancy() {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
        dispatch(meeting_all({}) as any);
    }

    useEffect(() => {
        initdependancy();
    }, []);
    async function handle_submit(e) {
        e.preventDefault();
        let response = await dispatch(update(new FormData(e.target)) as any);
    }
    console.log('staet item', state?.item?.agenda?.date);

    useEffect(() => {
        if (meetingId.current) {
            meetingId.current.value = state.item?.agenda?.meeting_id || ''; // Safely set the value
        }
        // console.log('Updated meetingId:', meetingId.current?.value);
    }, [state.meeting]);
    useEffect(() => {
        setMeetingType(state.item?.agenda?.meeting_type);
    }, [state.item?.agenda?.meeting_type]);

    useEffect(() => {
        if (state.item) {
            setStartDate(
                moment(state?.item?.agenda?.date).format('YYYY-MM-DD'),
            );
        }
    }, [state?.item?.agenda]);
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
                                    defaultValue={state.item?.agenda?.id}
                                />
                                <div className="form-group form-horizontal">
                                    <label>
                                        Meeting{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select
                                            name="meeting_id"
                                            id=""
                                            ref={meetingId}
                                            // defaultValue={meetingId}
                                        >
                                            {state?.meeting?.length &&
                                                state.meeting?.map(
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
                                        Title{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="title"
                                            name="title"
                                            defaultValue={
                                                state.item?.agenda?.title
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Description</label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="description"
                                            name="description"
                                            defaultValue={
                                                state.item?.agenda?.description
                                            }
                                        />
                                    </div>
                                </div>
                                {/* <div className="form-group form-horizontal">
                                    <label>
                                        Date{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            defaultValue={moment(
                                                state.item.agenda?.date,
                                            ).format('YYYY-MM-DD')}
                                            name="date"
                                        ></input>
                                    </div>
                                </div> */}
                                <div className="form-group form-horizontal">
                                    <label>
                                        Date{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            name="date"
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
                                        Time{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="time"
                                            defaultValue={moment(
                                                state.item.agenda?.time,
                                                'HH:mm:ss',
                                            ).format('hh:mm:ss')}
                                            name="time"
                                        ></input>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Meeting Type{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select
                                            name="meeting_type"
                                            defaultValue={
                                                state.item?.agenda?.meeting_type
                                            }
                                            onChange={(e) =>
                                                setMeetingType(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Select type
                                            </option>
                                            <option value="online">
                                                Online
                                            </option>
                                            <option value="offline">
                                                Offline
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {meetingType === 'online' && (
                                    <div className="form-group form-horizontal">
                                        <label>
                                            Meeting Link{' '}
                                            <span className="valid_star">
                                                *
                                            </span>
                                        </label>
                                        <div className="form_elements">
                                            <textarea
                                                name="meeting_link"
                                                placeholder="Enter meeting link"
                                                defaultValue={
                                                    state.item?.agenda
                                                        ?.meeting_link
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                                <div className="form-group form-horizontal">
                                    <label>
                                        Group{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select
                                            name="role"
                                            defaultValue={
                                                state.item?.agenda?.role
                                            }
                                            id=""
                                        >
                                            <option value="">
                                                Select group
                                            </option>
                                            <option value="admission-officer">
                                                admission-officer
                                            </option>
                                            <option value="accountant">
                                                accountant
                                            </option>
                                            <option value="teacher">
                                                teacher
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Meeting Status{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select
                                            name="is_complete"
                                            defaultValue={
                                                state.item?.agenda?.is_complete
                                            }
                                            id=""
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="completed">
                                                Complete
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group student_submit form-horizontal">
                                    {/* <label></label> */}
                                    <div className="form_elementss">
                                        <button
                                            className={`btn btn_1 ${errorMessage ? 'btn_error' : ''}`}
                                            disabled={!!errorMessage}>
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
