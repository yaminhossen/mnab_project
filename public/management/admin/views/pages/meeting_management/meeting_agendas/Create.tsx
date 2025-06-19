import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { store } from './config/store/async_actions/store';
import DropDown from './components/dropdown/DropDown';
import { json, useParams } from 'react-router-dom';
import storeSlice from './config/store';
import { meeting_all } from './config/store/async_actions/meeting_all';
import { initialState } from './config/store/inital_state';
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();
    const [meetingType, setMeetingType] = useState('');
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));

    const [errorMessage, setErrorMessage] = useState('');

    async function handle_submit(e) {
        e.preventDefault();
        let response = await dispatch(store(new FormData(e.target)) as any);
        if (!Object.prototype.hasOwnProperty.call(response, 'error')) {
            e.target.reset();
        }
    }
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(meeting_all({}) as any);
    }, []);
    console.log('state meeting', state.meeting);
    // if (state.meeting.length < 1) return <></>;
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
                    <Header page_title={setup.create_page_title}></Header>
                    <div className="content_body custom_scroll">
                        <form
                            onSubmit={(e) => handle_submit(e)}
                            className="form_600 mx-auto pt-3"
                        >
                            <div className="">
                                <div className="form-group form-horizontal">
                                    <label>
                                        Meeting{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select name="meeting_id" id="">
                                            <option value="">
                                                Select Meeting
                                            </option>
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
                                {/* <div> thsi si five {state.meeting.length}</div> */}
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
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Description</label>
                                    <div className="form_elements">
                                        <textarea
                                            name="description"
                                            id=""
                                            placeholder="description"
                                        ></textarea>
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
                                        <input type="time" name="time"></input>
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
                                            value={meetingType}
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
                                        <select name="role" id="">
                                            <option value="">
                                                Select group
                                            </option>
                                            <option value="admission-officer">
                                                Admission-officer
                                            </option>
                                            <option value="account">
                                                Accountant
                                            </option>
                                            <option value="teacher">
                                                Teacher
                                            </option>
                                            <option value="staff">Staff</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group student_submit form-horizontal">
                                {/* <label></label> */}
                                <div className="form_elementss">
                                    <button
                                        type="submit"
                                        className={`btn btn_1 ${errorMessage ? 'btn_error' : ''}`}
                                        disabled={!!errorMessage}
                                    >
                                        submit
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
