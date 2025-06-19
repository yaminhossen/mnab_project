import React, { useEffect, useState } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import setup from './config/setup';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { useParams } from 'react-router-dom';
import storeSlice from './config/store';
import moment from 'moment/moment';
import { all_staff_task } from './config/store/async_actions/all_staff_task';
import { all_teacher_task } from './config/store/async_actions/all_teacher_task';
import { assign_task_update } from './config/store/async_actions/assign_task_update';
export interface Props {}

const Edit: React.FC<Props> = (props: Props) => {
    const [staffs, setStaffs] = useState<number[]>([]);
    const [teachers, setTeachers] = useState<number[]>([]);
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const [startDate, setStartDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useAppDispatch();
    const params = useParams();
    let id = params.id;
    console.log('assing page id', id);

    async function initdependancy() {
        await dispatch(storeSlice.actions.set_item({}));
        await dispatch(details({ id: id }) as any);
        await dispatch(all_staff_task({ id: id }) as any);
        await dispatch(all_teacher_task({ id: id }) as any);
    }

    useEffect(() => {
        initdependancy();
    }, []);

    // Initialize pre-assigned staffs
    useEffect(() => {
        if (state?.staffs?.length) {
            const preAssignedStaffIds = state.staffs
                .filter((staff: any) => staff.taskstaffs !== null)
                .map((staff: any) => staff.id);
            setStaffs(preAssignedStaffIds);
        }
    }, [state.staffs]);

    // Initialize pre-assigned staffs
    useEffect(() => {
        if (state?.teachers?.length) {
            const preAssignedStaffIds = state.teachers
                .filter((staff: any) => staff.taskteachers !== null)
                .map((staff: any) => staff.id);
            setTeachers(preAssignedStaffIds);
        }
    }, [state.teachers]);

    function toggleStaff(id: number, user: string) {
        if (user === 'staff') {
            setStaffs((prevStaffs) => {
                if (prevStaffs.includes(id)) {
                    // Remove the ID if it's already in the array
                    return prevStaffs.filter((staffId) => staffId !== id);
                } else {
                    // Add the ID if it's not in the array
                    return [...prevStaffs, id];
                }
            });
        } else if (user === 'teacher') {
            setTeachers((prevStaffs) => {
                if (prevStaffs.includes(id)) {
                    // Remove the ID if it's already in the array
                    return prevStaffs.filter((staffId) => staffId !== id);
                } else {
                    // Add the ID if it's not in the array
                    return [...prevStaffs, id];
                }
            });
        }
    }

    useEffect(() => {
        if (state.item) {
            setTitle(state.item.title || '');
            setStartDate(moment(state.item.date).format('YYYY-MM-DD'));
            setDescription(state.item.description || '');
            setDate(moment(state.item.date).format('YYYY-MM-DD') || '');
        }
    }, [state.item]);
    console.log('notun data', state?.item);

    async function handle_submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            let formdata = new FormData(e.target as HTMLFormElement) as any;

            formdata.append('staffs', JSON.stringify(staffs));
            formdata.append('teachers', JSON.stringify(teachers));
            formdata.append('id', id);

            let response = await dispatch(assign_task_update(formdata) as any);
            console.log('response', response);
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    }

    let formateddata = moment().format('YYYY-MM-DD');
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
                    <div className="content_body custom_scroll">
                        <form
                            onSubmit={(e) => handle_submit(e)}
                            className="form_600f mx-auto pt-3"
                        >
                            <div className="form_600">
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
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
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
                                            id=""
                                            placeholder="description"
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                        ></textarea>
                                    </div>
                                </div>
                                {/* <div className="form-group form-horizontal">
                                    <label>Date</label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            name="date"
                                            value={date}
                                            onChange={(e) =>
                                                setDate(
                                                    moment(
                                                        e.target.value,
                                                    ).format('YYYY-MM-DD'),
                                                )
                                            }
                                            id=""
                                        />
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
                            </div>
                            <div>
                                <div>
                                    <h1 className="my-2">Staffs :</h1>
                                    <div>
                                        <ul className="assign_tasks">
                                            {state?.staffs?.length &&
                                                state?.staffs?.map(
                                                    (
                                                        i: {
                                                            [key: string]: any;
                                                        },
                                                        index,
                                                    ) => {
                                                        return (
                                                            <li
                                                                className="assign_task_list"
                                                                onClick={() =>
                                                                    toggleStaff(
                                                                        i.id,
                                                                        'staff',
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <div>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={
                                                                            i.id
                                                                        }
                                                                        checked={staffs.includes(
                                                                            i.id,
                                                                        )}
                                                                        // readOnly
                                                                    />
                                                                </div>
                                                                <div>:</div>
                                                                <div>
                                                                    {i.name}
                                                                </div>
                                                            </li>
                                                        );
                                                    },
                                                )}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="my-4">Teachers :</h1>
                                    <div>
                                        <ul className="assign_tasks">
                                            {state?.teachers?.length &&
                                                state?.teachers?.map(
                                                    (
                                                        i: {
                                                            [key: string]: any;
                                                        },
                                                        index,
                                                    ) => {
                                                        return (
                                                            <li
                                                                className="assign_task_list"
                                                                onClick={() =>
                                                                    toggleStaff(
                                                                        i.id,
                                                                        'teacher',
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <div>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={
                                                                            i.id
                                                                        }
                                                                        checked={teachers.includes(
                                                                            i.id,
                                                                        )}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                                <div>:</div>
                                                                <div>
                                                                    {i.name}
                                                                </div>
                                                            </li>
                                                        );
                                                    },
                                                )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group student_submit form-horizonta">
                                <div className="task_assign_submit_btn">
                                    <button
                                        className={`btn btn_1 ${errorMessage ? 'btn_error' : ''}`}
                                        disabled={!!errorMessage}
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

export default Edit;
