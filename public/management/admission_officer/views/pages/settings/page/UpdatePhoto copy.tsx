import React, { useState, useEffect, useRef } from 'react';
import { anyObject } from '../../../../../common_types/object';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import InputImage from './InputImage';
export interface Props {}

const UpdatePhoto: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState<{ image?: string }>({});
    const [data, setData] = useState<any>();
    const formRef = useRef<HTMLFormElement>(null); // useRef for form

    const fetchData = async () => {
        try {
            const response = await axios.get(
                '/api/v1/user-staffs/admin-details',
            );
            setData(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    function get_value(key) {
        try {
            if (data['image']) return data['image'];
        } catch (error) {
            return '';
        }
        return '';
    }
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const form = formRef.current;
        if (!form) return;

        const formData = new FormData(form);
        console.log('ne form data', formData);
        const image = formData.get('image') as File;
        const newErrors: { image?: string } = {};

        if (!image || image.size === 0) {
            newErrors.image = 'Please select the image.';
        }
        // Set errors and stop submit if any
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({}); // Clear errors
        try {
            const response = await axios.post(
                '/api/v1/admin-users/profile-update',
                formData,
            );
            (window as any).toaster('Form submitted successfully!');
            form.reset(); // Reset form on success
            fetchData();
        } catch (error) {
            // setError(error); // Set error state
        }
    };

    return (
        <div className="admin_dashboard">
            <div className="content_body">
                <form
                    onSubmit={handleSubmit}
                    className="form_600 mx-auto pt-3"
                    ref={formRef}
                >
                    <div className="form-group form-horizontal">
                        <label>Previous Photo</label>
                        <div className="form_elements">
                            <img src={data?.image} alt="" />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>New Photo</label>
                        <div className="form_elements">
                            {/* <input type="file" accept="image/*" name="image" /> */}
                            <InputImage
                                label={''}
                                name={'image'}
                                defalut_preview={''}
                            />
                            {errors.image && (
                                <p style={{ color: 'red' }}>{errors.image}</p>
                            )}
                        </div>
                    </div>
                    <div className="form-group student_submit form-horizontal">
                        {/* <label></label> */}
                        <div className="form_elementss">
                            <button className="btn btn-sm btn-outline-info">
                                Update
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePhoto;
