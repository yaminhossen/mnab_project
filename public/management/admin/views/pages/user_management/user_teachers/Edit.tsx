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
import InputImage from './components/management_data_page/InputImage';
export interface Props {}

const Edit: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);

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

    async function handle_submit(e) {
        e.preventDefault();
        let response = await dispatch(update(new FormData(e.target)) as any);
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
                                        Name{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="name"
                                            name="name"
                                            defaultValue={state.item.name}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Email{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="email"
                                            placeholder="email"
                                            name="email"
                                            defaultValue={state.item.email}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Password{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div
                                        className="form_elements_valid"
                                        style={{ position: 'relative' }}
                                    >
                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Password"
                                            name="password"
                                            style={{
                                                paddingRight: '40px',
                                                width: '214px',
                                            }}
                                        />
                                        <span
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="material-symbols-outlined visible_icon"
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                cursor: 'pointer',
                                                color: '#666',
                                                fontSize: '24px',
                                                userSelect: 'none',
                                            }}
                                        >
                                            {showPassword
                                                ? 'visibility_off'
                                                : 'visibility'}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Phone number{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="phone number"
                                            name="phone_number"
                                            defaultValue={
                                                state.item.phone_number
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <InputImage
                                        label={'image'}
                                        name={'teacher_image'}
                                        defalut_preview={get_value('image')}
                                    />
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Parmanent Address{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="Parmenent address"
                                            name="parmenent_address"
                                            defaultValue={
                                                state.item.teacher_infos
                                                    ?.parmenent_address
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Country</label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="country"
                                            name="country"
                                            defaultValue={
                                                state.item.teacher_infos
                                                    ?.country
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>District</label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="district"
                                            name="district"
                                            defaultValue={
                                                state.item.teacher_infos
                                                    ?.district
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Post Code</label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="post_code"
                                            name="post_code"
                                            defaultValue={
                                                state.item.teacher_infos
                                                    ?.post_code
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Present Address</label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="present address"
                                            name="present_address"
                                            defaultValue={
                                                state.item.teacher_infos
                                                    ?.present_address
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>
                                        Alternative Number{' '}
                                        <span className="valid_star">*</span>
                                    </label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="guardian number"
                                            name="guardian_contact_number"
                                            defaultValue={
                                                state.item.teacher_infos
                                                    ?.guardian_contact_number
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Gender</label>
                                    <div className="form_elements">
                                        <select
                                            name="gender"
                                            id=""
                                            defaultValue={
                                                state.item.teacher_infos?.gender
                                            }
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Is Married</label>
                                    <div className="form_elements">
                                        <select
                                            name="is_married"
                                            defaultValue={
                                                state.item.teacher_infos
                                                    ?.is_married === true
                                                    ? 1
                                                    : 0
                                            }
                                            id=""
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Blood group</label>
                                    <div className="form_elements">
                                        <select
                                            name="blood_group"
                                            defaultValue={
                                                state.item.teacher_infos
                                                    ?.blood_group
                                            }
                                            id=""
                                        >
                                            <option value="A+">A+</option>
                                            <option value="B+">B+</option>
                                            <option value="A-">A-</option>
                                            <option value="AB-">AB-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <label>Joining Date</label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            name="joining_date"
                                            defaultValue={moment(
                                                state.item.teachers
                                                    ?.joining_date,
                                            ).format('YYYY-MM-DD')}
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-horizontal">
                                    <InputImage
                                        label={'National Id'}
                                        name={'national_id'}
                                        defalut_preview={get_value(
                                            'national_id',
                                        )}
                                    />
                                </div>
                                <div className="form-group form-horizontal">
                                    <InputImage
                                        label={'Certificate No. 1'}
                                        name={'certificate_1'}
                                        defalut_preview={get_value(
                                            'certificate_no_1',
                                        )}
                                    />
                                </div>
                                <div className="form-group form-horizontal">
                                    <InputImage
                                        label={'Certificate No. 2'}
                                        name={'certificate_2'}
                                        defalut_preview={get_value(
                                            'certificate_no_2',
                                        )}
                                    />
                                </div>
                                <div className="form-group student_submit form-horizontal">
                                    {/* <label></label> */}
                                    <div className="form_elementss">
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
