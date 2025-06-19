import React, { useState, useEffect } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import BackButton from './BackButton';
export interface Props {}

const SubjectDetails: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const { id } = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/api/v1/assignments/sub-wise-assignment/${id}`,
            );
            setData(response.data.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleMarkBlur = async (e: any, i: any) => {
        const mark = e.target.name == 'mark' ? e.target.value : null;
        const id = i.student_id;
        console.log('Student id:', id);
        console.log('Student mark:', mark);
        try {
            const payload = {
                mark,
                id,
            };
            const response = await axios.post(
                '/api/v1/assignment-submissions/assignment-marking',
                payload,
            );
            fetchData();
            e.target.value = '';
            console.log('response', 'response');
        } catch (error) {
            // setError(error); // Set error state
        }
    };

    return (
        <div className="admin_dashboard">
            <BackButton></BackButton>
            <div className="result_details"></div>
            <div className="content_body">
                <div className="data_list">
                    <div className="table_responsive custom_scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Serial</th>
                                    <th></th>
                                    <th>Title</th>
                                    <th>Mark</th>
                                    <th>Show</th>
                                    {/* <th>Input</th> */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {data?.length ? (
                                <tbody id="all_list">
                                    {data?.map(
                                        (i: { [key: string]: any }, index) => {
                                            return (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td></td>
                                                    <td>{i.title}</td>
                                                    <td>{i.mark}</td>

                                                    <td>
                                                        <a
                                                            target="blank"
                                                            href={i.attachment}
                                                            download={i.attachment
                                                                .split('/')
                                                                .pop()}
                                                        >
                                                            download
                                                        </a>
                                                    </td>
                                                    {/* <td><input type="file" name="" id="" /></td> */}
                                                    <td>
                                                        <Link
                                                            className="btn btn-sm btn-outline-info mr-1"
                                                            to={`/assignments/create/${i.id}`}
                                                        >
                                                            Take assignment
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan={9}>
                                            <div
                                                style={{
                                                    fontSize: '24px',
                                                }}
                                                className="not_found f-size-4 m-4"
                                            >
                                                No data found
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectDetails;
