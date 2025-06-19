import React, { useState, useEffect, useRef } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import BackButton from './BackButton';
import InputImage, { InputImageRef } from './InputImage';
export interface Props {}

const Create: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<any>([]);
    const inputImageRef = useRef<InputImageRef>(null);
    const { id } = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/v1/assignments/${id}`);
            setData(response.data.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    console.log('data data data', data);
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        let formData = new FormData(e.target);
        if (id !== undefined) {
            formData.append('id', id); // id must be string or cast if needed
        }

        try {
            // Make POST request with form data
            const response = await axios.post(
                '/api/v1/assignment-submissions/store',
                formData,
            );
            (window as any).toaster(response.data.message);
            console.log('respose data message', response.data.message);
        } catch (error) {
            // setError(error); // Set error state
            // setResponseMessage('Failed to submit form.');
            console.log('data', error.msg);
        }
        // console.log('data', error);
    };
    let date = moment().format('YYYY-DD-MM');
    console.log('date', date);

    return (
        <div className="admin_dashboard">
            <BackButton></BackButton>
            <div className="content_body">
                <form onSubmit={handleSubmit} className="form_600 mx-auto pt-3">
                    <div className="form-group form-horizontal">
                        <label>Title</label>
                        <div className="form_elements">
                            <input
                                type="text"
                                defaultValue={data?.title}
                                name="title"
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>Description</label>
                        <div className="form_elements">
                            <textarea
                                defaultValue={data?.description}
                                name="description"
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>Comment</label>
                        <div className="form_elements">
                            <textarea
                                // defaultValue={data?.description}
                                placeholder="write your comments here"
                                name="comments"
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>Submission Date</label>
                        <div className="form_elements">
                            <input
                                type="date"
                                defaultValue={moment().format('YYYY-MM-DD')}
                                name="submission_date"
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>Attchment</label>
                        <div className="form_elements">
                            <InputImage
                                // ref={inputImageRef}
                                label=""
                                name="attachment"
                                defalut_preview=""
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label></label>
                        <div className="form_elements">
                            <button className="btn btn-sm btn-outline-info">
                                submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Create;
