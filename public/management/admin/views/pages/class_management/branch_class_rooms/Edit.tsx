import React, { useEffect, useRef } from 'react';
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
import { building } from './config/store/async_actions/building';
import InputImage from './components/management_data_page/InputImage';
export interface Props {}

const Edit: React.FC<Props> = (props: Props) => {
    const buildingId = useRef<HTMLSelectElement>(null);
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    async function handle_submit(e) {
        e.preventDefault();
        let response = await dispatch(update(new FormData(e.target)) as any);
    }

    async function initdependancy() {
        await dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
        await dispatch(building({}) as any);
    }

    useEffect(() => {
        initdependancy();
    }, []);
    useEffect(() => {
        if (buildingId.current) {
            buildingId.current.value = state.item?.building_id || '';
        }
        // console.log('Updated buildingId:', buildingId.current?.value);
    }, [state.building]);

    function get_value(key) {
        try {
            if (state.item[key]) return state.item[key];
            if (state.item?.staff_infos[key])
                return state.item?.staff_infos[key];
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
                                        Building id{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <select
                                            name="building_id"
                                            id=""
                                            ref={buildingId}
                                        >
                                            {state?.building?.length &&
                                                state.building?.map(
                                                    (i: {
                                                        [key: string]: any;
                                                    }) => {
                                                        return (
                                                            <option
                                                                value={i.id}
                                                            >
                                                                {
                                                                    i.building_name
                                                                }
                                                            </option>
                                                        );
                                                    },
                                                )}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Room Name{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="room name"
                                            name="room_name"
                                            defaultValue={state.item.room_name}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Room code{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="room code"
                                            name="room_code"
                                            defaultValue={state.item.room_code}
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
                                            placeholder="description"
                                            name="description"
                                            defaultValue={
                                                state.item.description
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Total seat{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="total seat"
                                            name="total_seat"
                                            defaultValue={state.item.total_seat}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Total student{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="total student"
                                            name="total_student"
                                            defaultValue={
                                                state.item.total_student
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Attachment</label>
                                    <div className="form_elements">
                                        <InputImage
                                            label={''}
                                            name={'attachment'}
                                            defalut_preview={get_value(
                                                'attachment',
                                            )}
                                        />
                                        {/* <input
                                            type="file"
                                            accept="image/*"
                                            placeholder="attachment"
                                            name="attachment"
                                        /> */}
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Photo</label>
                                    <div className="form_elements">
                                        <InputImage
                                            label={''}
                                            name={'photo'}
                                            defalut_preview={get_value('photo')}
                                        />
                                        {/* <input
                                            type="file"
                                            accept="image/*"
                                            placeholder="photo"
                                            name="photo"
                                        /> */}
                                    </div>
                                </div>
                                <div className="form-group student_submit form-horizontal">
                                    <label></label>
                                    <div className="form_elements">
                                        <button className="btn btn_1">
                                            Update
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
