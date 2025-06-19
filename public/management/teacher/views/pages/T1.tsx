import React, { useState, useEffect } from 'react';
import { anyObject } from '../../common_types/object';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
export interface Props {}

const T1: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState();
    const [accdemicCalander, setAccademicCalander] = useState<any[]>([]);
    const [noticeCount, setNoticeCount] = useState(0);
    const [taskCount, setTaskCount] = useState(0);
    // console.log(accdemicCalander);

    const [selectedDate, setSelectedDate] = useState(
        moment().format('YYYY-MM-DD'),
    ); // Default to today's date

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value); // Update the selected date
    };

    // Dynamically format month and year based on the selected date
    const selectedMoment = moment(selectedDate);
    const month = selectedMoment.format('MMM').toLowerCase(); // e.g., "jan"
    const year = selectedMoment.format('YYYY'); // e.g., "2025"
    const formattedDate = `${month}-${year}`;

    // Fetch notice count
    const fetchNoticeCount = async () => {
        try {
            const response = await axios.get('/api/v1/notices/all/teachers');
            setNoticeCount(response.data.data.length);
        } catch (error) {
            console.error('Error fetching notice count:', error);
            setError(error);
        }
    };
    // Fetch notice count
    const fetchTaskCount = async () => {
        try {
            const response = await axios.get('/api/v1/tasks/teachers');
            setTaskCount(response.data.data.length);
        } catch (error) {
            console.error('Error fetching notice count:', error);
            setError(error);
        }
    };

    useEffect(() => {
        fetchNoticeCount();
        fetchTaskCount();
    }, []);
    console.log('lsdjfkldsta task coutn', taskCount);
    let days = [
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
    ];

    function dateFormate(date: string) {
        return moment(date).format('dddd').toLowerCase();
    }
    // console.log('date', dateFormate('2024-09-07T00:00:00.000Z'));

    function get_day_data(i, day) {
        if (dateFormate(i.date) === day) {
            return (
                <li className="absent">
                    <time dateTime="2022-02-02">{i.id}</time>
                    <div className="text-warning">
                        <i className="icon-close"></i>
                        <span className="event_title">Class Present</span>
                    </div>
                </li>
            );
        } else {
            return (
                <li className="absent">
                    <time dateTime="2022-02-02">{i.id}</time>
                </li>
            );
        }
    }

    const fetchAccedemicCalenderData = async () => {
        try {
            const response = await axios.post(
                '/api/v1/academic-calendars/get-academic-event-by-month',
                {
                    month: formattedDate,
                    branch_id: 1,
                },
            );

            // Assuming setAccademicCalander is a state setter function
            setAccademicCalander(response.data.data);

            // Clear any previous errors
            setError(null);
        } catch (error) {
            console.error('Error fetching academic calendar data:', error);
            setError(error); // Assuming setError is a state setter for errors
        }
    };
    useEffect(() => {
        fetchAccedemicCalenderData();
    }, [selectedDate]);

    let array: any[][] = [];
    let count = 0;

    // Initialize the 2D array
    for (let i = 0; i < 5; i++) {
        array[i] = []; // Initialize each row

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
            <div className="name my-3">
                <h2></h2>
            </div>
            {/* analytics */}
            <div
                className="mt-4"
                style={{
                    display: 'grid',
                    gap: '30px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr)',
                }}
            >
                {[
                    {
                        title: 'নোটিশ',
                        value: noticeCount,
                    },
                    {
                        title: 'টাস্ক',
                        value: taskCount,
                    },
                    // {
                    //     title: 'এই মাসের উপস্থিতি',
                    //     value: '78 / 88',
                    // },
                    // {
                    //     title: 'উপস্থিতি %',
                    //     value: 89,
                    // },
                ].map((i) => {
                    return (
                        <div
                            className="card w-100 mb-0"
                            data-intro="This is card"
                        >
                            <div className="business-top-widget card-body">
                                <h5 className="mb-2">{i.title}</h5>
                                <div className="media d-inline-flex">
                                    <div className="media-body">
                                        <h2 className="total-value m-0 counter">
                                            {i.value}
                                        </h2>
                                    </div>
                                    <i
                                        style={{ opacity: '.4' }}
                                        className="icon-bar-chart font-info align-self-center"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    );
                })}
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
                                    <>
                                        {
                                            <li
                                                key={`${vIndex}- ${eIndex}`}
                                                className={`${element.day === 5 ? 'absent' : ''} || ${moment(element.date).isSame(moment(), 'day') ? 'today' : ''}`}
                                            >
                                                <time dateTime={element.date}>
                                                    {moment(
                                                        element.date,
                                                    ).format('D')}{' '}
                                                </time>
                                                {/* {element.day} */}
                                                {moment(element.date).format(
                                                    'dddd',
                                                )}
                                                <div
                                                    className={`text-${element.events?.length ? 'warning' : 'info'} custom_scroll`}
                                                >
                                                    {element.events?.map(
                                                        (ev, i) => (
                                                            <div
                                                                key={i}
                                                                className="event"
                                                            >
                                                                <i className="icon-check-box"></i>
                                                                <span className="event_title">
                                                                    {
                                                                        ev.event_name
                                                                    }
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </li>
                                        }
                                    </>
                                )),
                            )}
                        </ul>
                        {/* <ul>
                            {days.map((index, day) => get_day_data(index, day))}
                        </ul> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default T1;
