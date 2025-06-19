import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
export interface Props {}

const T1: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<any[]>([]);
    const [accdemicCalander, setAccademicCalander] = useState<any[]>([]);
    const [noticeCount, setNoticeCount] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [selectedDate, setSelectedDate] = useState(
        moment().format('YYYY-MM-DD'),
    );

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // Dynamically format month and year based on the selected date
    const selectedMoment = moment(selectedDate);
    const month = selectedMoment.format('MMM').toLowerCase();
    const year = selectedMoment.format('YYYY');
    const formattedDate = `${month}-${year}`;

    // Fetch notice count
    const fetchNoticeCount = async () => {
        try {
            const response = await axios.get(
                '/api/v1/notices/all/admission-officer',
            );
            setNoticeCount(response.data.data.length);
        } catch (error) {
            console.error('Error fetching notice count:', error);
            setError(error);
        }
    };

    // Fetch total student count
    const fetchStudentCount = async () => {
        try {
            const response = await axios.get('/api/v1/user-students/all-class');
            const total = response.data.data.reduce(
                (sum, classItem) => sum + classItem.count,
                0,
            );
            setTotalStudents(total);
        } catch (error) {
            console.error('Error fetching student count:', error);
            setError(error);
        }
    };

    // Fetch academic calendar data
    const fetchAccedemicCalenderData = async () => {
        try {
            const response = await axios.post(
                '/api/v1/academic-calendars/get-academic-event-by-month',
                {
                    month: formattedDate,
                    branch_id: 1,
                },
            );
            setAccademicCalander(response.data.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching academic calendar data:', error);
            setError(error);
        }
    };

    useEffect(() => {
        fetchNoticeCount();
        fetchStudentCount();
        fetchAccedemicCalenderData();
    }, [selectedDate]);

    let array: any[][] = [];
    let count = 0;

    // Initialize the 2D array for calendar
    for (let i = 0; i < 5; i++) {
        array[i] = [];
        for (let j = 0; j < 7; j++) {
            if (count < accdemicCalander.length) {
                array[i][j] = accdemicCalander[count] || { date: '', day: '' };
                count++;
            } else {
                continue;
            }
        }
    }

    return (
        <div className="custom_scroll">
            {/* analytics */}
            <div
                className="mt-4"
                style={{
                    display: 'grid',
                    gap: '30px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                }}
            >
                {[
                    { title: 'নোটিশ', value: noticeCount },
                    { title: 'মোট ছাত্র/ছাত্রী', value: totalStudents },
                ].map((item, index) => (
                    <div
                        className="card w-100"
                        key={index}
                        data-intro="This is card"
                    >
                        <div className="business-top-widget card-body">
                            <h5 className="mb-2">{item.title}</h5>
                            <div className="media d-inline-flex">
                                <div className="media-body">
                                    <h2 className="total-value m-0 counter">
                                        {item.value}
                                    </h2>
                                </div>
                                <i
                                    style={{ opacity: '.4' }}
                                    className="icon-bar-chart font-info align-self-center"
                                ></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* attendance calendar */}
            <div className="calendar_dashboard mt-4">
                <div className="card mx-auto">
                    <div className="card-header d-flex justify-content-between flex-wrap">
                        <h5>
                            <i className="icon-calendar me-2"></i>
                            Academic Calendar
                        </h5>
                        <h5>
                            {formattedDate}
                            <span className="ml-2">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </span>
                        </h5>
                    </div>
                    <div className="card-body">
                        <ul>
                            {array.map((value, vIndex) =>
                                value.map((element, eIndex) => (
                                    <li
                                        key={`${vIndex}-${eIndex}`}
                                        className={`${element.day === 5 ? 'absent' : ''} ${moment(element.date).isSame(moment(), 'day') ? 'today' : ''}`}
                                    >
                                        <time dateTime={element.date}>
                                            {moment(element.date).format('D')}{' '}
                                        </time>
                                        {moment(element.date).format('dddd')}
                                        <div
                                            className={`events-container ${element.events?.length ? 'text-warning' : 'text-info'} custom_scroll`}
                                        >
                                            {element.events?.map((ev, i) => (
                                                <div key={i} className="event">
                                                    <i className="icon-check-box text-xs"></i>
                                                    <span className="text-sm">
                                                        {ev.event_name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </li>
                                )),
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default T1;
