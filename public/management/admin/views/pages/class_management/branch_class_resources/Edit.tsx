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
import { classes } from './config/store/async_actions/classes';
import axios from 'axios';
import InputImage from './components/management_data_page/InputImage';
export interface Props {}

const Edit: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState<any>([]);
    const [classId, setClassId] = useState<any>(Number);
    const search_input = useRef<HTMLSelectElement>(null);
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/api/v1/branch-class-subjects/class-wise-subject/${state.item.branch_class_id}`,
            );
            setSubjects(response.data.data);
        } catch (error) {
            setError(error);
        }
    };

    async function initdependancy() {
        await dispatch(storeSlice.actions.set_item({}));
        await dispatch(classes({}) as any);
        dispatch(details({ id: params.id }) as any);
    }

    useEffect(() => {
        initdependancy();
    }, []);

    useEffect(() => {
        fetchData();
    }, [state.item.branch_class_id]);

    async function handle_submit(e) {
        e.preventDefault();
        let response = await dispatch(update(new FormData(e.target)) as any);
    }
    const handleChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        let id = event.target.value;
        try {
            const response = await axios.get(
                `/api/v1/branch-class-subjects/class-wise-subject/${id}`,
            );
            setSubjects(response.data.data);
        } catch (error) {
            setError(error);
        }
    };
    function get_value(key) {
        try {
            if (state.item[key]) return state.item[key];
            if (state.item?.teacher_infos[key])
                return state.item?.teacher_infos[key];
        } catch (error) {
            return '';
        }
        return '';
    }

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.edit_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body">
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
                                    <label>Branch Class id{' '}
                                                <span className="valid_star">
                                                    *
                                                </span></label>
                                    <div className="form_elements">
                                        <select
                                            name="class"
                                            id=""
                                            onChange={handleChange}
                                            defaultValue={
                                                state.item.branch_class_id
                                            }
                                        >
                                            {state?.classes?.length &&
                                                state.classes?.map(
                                                    (i: {
                                                        [key: string]: any;
                                                    }) => {
                                                        return (
                                                            <option
                                                                value={i.id}
                                                            >
                                                                {i.name}
                                                            </option>
                                                        );
                                                    },
                                                )}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Branch Class subject id{' '}
                                                <span className="valid_star">
                                                    *
                                                </span></label>
                                    <div className="form_elements">
                                        {subjects.length && (
                                            <select
                                                name="subject"
                                                id=""
                                                defaultValue={
                                                    state.item
                                                        .branch_class_subject_id
                                                }
                                            >
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
                                    <label>Title {' '}
                                                <span className="valid_star">
                                                    *
                                                </span></label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="title"
                                            name="title"
                                            defaultValue={state.item.title}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Description</label>
                                    <div className="form_elements">
                                        <textarea
                                            placeholder="description"
                                            name="description"
                                            defaultValue={
                                                state.item.description
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Attachment{' '}
                                                <span className="valid_star">
                                                    *
                                                </span></label>
                                    <div className="form_elements">
                                        {/* <input
                                            type="file"
                                            name="attachment"
                                            accept="image/*, ./*"
                                        /> */}
                                        <InputImage
                                            label={'attachment'}
                                            name={'attachment'}
                                            // accept="image/*, ./*"
                                            accept="image/*,application/pdf"
                                            defalut_preview={get_value(
                                                'attachment',
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="form-group student_submit form-horizontal">
                                    {/* <label></label> */}
                                    <div className="form_elementss">
                                        <button className="btn btn_1">
                                            submit
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
