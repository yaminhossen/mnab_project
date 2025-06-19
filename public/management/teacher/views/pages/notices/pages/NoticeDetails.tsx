import React, { useState, useEffect } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import BackButton from './BackButton';
export interface Props {}
const NoticeDetails: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<any>({});
    const { id } = useParams();

    useEffect(() => {
        // Function to fetch data
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/v1/notices/${id}`);
            setData(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    console.log(data);
    return (
        <div className="admin_dashboard user_notice">
            <BackButton></BackButton>
            <div className="col-md-6">
                <h3>{data?.title}</h3>
                <p>{data?.description}</p>
                <div className="user_notice_part">
                    <img src={data?.attachment} alt="" />
                </div>
            </div>
        </div>
    );
};

export default NoticeDetails;
