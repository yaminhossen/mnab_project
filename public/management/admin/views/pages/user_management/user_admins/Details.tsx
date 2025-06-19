import React, { useEffect } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { useParams } from 'react-router-dom';
import storeSlice from './config/store';
import moment from 'moment/moment';
export interface Props {}

const Details: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_item({}));
        dispatch(details({ id: params.id }) as any);
    }, []);
    if (state) {
        console.log('lksdfjklj  17', state.item);
    }

    return (
        <>
            <div className="page_content">
                <div className="explore_window fixed_size">
                    <Header page_title={setup.details_page_title}></Header>

                    {Object.keys(state.item).length && (
                        <div className="content_body custom_scroll">
                            <table className="table quick_modal_table table-hover">
                                <tbody>
                                    <tr>
                                        <td>Photo</td>
                                        <td>:</td>
                                        <td>
                                            {state.item?.image ? (
                                                <a
                                                    href={state.item.image}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={
                                                            state.item.image
                                                                ? state.item
                                                                    .image
                                                                : '/assets/dashboard/images/avatar.png'
                                                        }
                                                        alt="profile image"
                                                        style={{
                                                            height: 50,
                                                        }}
                                                    />
                                                </a>
                                            ) : (
                                                <img
                                                    src={
                                                        '/assets/dashboard/images/avatar.png'
                                                    }
                                                    alt="profile image"
                                                    style={{
                                                        height: 50,
                                                    }}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Name</td>
                                        <td>:</td>
                                        <td>{state.item.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>:</td>
                                        <td>{state.item.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone Number</td>
                                        <td>:</td>
                                        <td>{state.item.phone_number}</td>
                                    </tr>
                                    <tr>
                                        <td>Role</td>
                                        <td>:</td>
                                        <td>{state.item.role}</td>
                                    </tr>
                                    {/* <tr>
                                        <td>Department</td>
                                        <td>:</td>
                                        <td>{state.item.staffs?.department}</td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <Footer></Footer>
                </div>
            </div>
        </>
    );
};

export default Details;
