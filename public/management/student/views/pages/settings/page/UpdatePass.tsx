import React, { useState, useEffect, useRef } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
export interface Props {}

const UpdatePass: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const form = formRef.current;
        let formData = new FormData(e.target);
        console.log('ne form data', formData);
        try {
            const response = await axios.post(
                '/api/v1/user-students/profile-update',
                formData,
            );
            (window as any).toaster('Password updated successfully');
            form?.reset();
            // setResponseMessage('Form submitted successfully!');
            // console.log('response', response);
        } catch (error) {
            // setError(error); // Set error state
        }
    };
    let date = moment().format('YYYY-MM-DD');
    console.log('pass ref', passRef);

    return (
        <div className="admin_dashboard">
            <div className="dues_back_btn">
                <h3 className="table_heading"></h3>
                <button className="back_btn settings_bacsk">
                    <Link to="/settings">
                        <span className="material-symbols-outlined fill">
                            arrow_back
                        </span>
                        <div className="text">Back</div>
                    </Link>
                </button>
            </div>
            <div className="content_body">
                {/* <div className="settings_back">
                    <Link
                        className="btn btn-sm btn-outline-info mb-1"
                        to="/settings"
                    >
                        Back
                    </Link>
                </div> */}
                <form
                    onSubmit={handleSubmit}
                    className="form_600 mx-auto pt-3"
                    ref={formRef}
                >
                    <div className="form-group form-horizontal">
                        <label>New Password</label>
                        <div
                            className="form_elements_valid"
                            style={{ position: 'relative' }}
                        >
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                name="password"
                                ref={passRef}
                                style={{
                                    paddingRight: '40px',
                                    width: '214px',
                                }}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
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
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </div>
                    </div>
                    <div className="form-group student_submit form-horizontal">
                        {/* <label></label> */}
                        <div className="form_elementss">
                            <button className="btn btn-sm btn-outline-info">
                                update
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePass;
