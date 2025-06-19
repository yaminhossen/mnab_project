import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Define interfaces for the JSON data structure
interface Class {
    id: number;
    name: string;
}

interface Subject {
    id: number;
    name: string;
    code: string;
    class: Class;
}

interface Room {
    id: number;
    room_code: string;
    room_name: string;
}

interface Teacher {
    id: number;
    name: string;
    email: string;
}

interface RoutineItem {
    id: number;
    branch_id: number;
    branch_class_routine_id: number;
    branch_teacher_id: number;
    branch_class_subject_id: number;
    branch_class_room_id: number;
    day: string | null;
    day_name: string;
    day_no: number;
    start_time: string;
    end_time: string;
    teacher: Teacher;
    room: Room;
    subject: Subject;
    branch_class_id: number;
}

interface Props {}

interface Schedule {
    time: string;
    room: string;
}

interface SubjectData {
    days: Schedule[];
}

interface GroupedData {
    [className: string]: {
        [subjectName: string]: SubjectData;
    };
}

const ClassRoutine: React.FC<Props> = () => {
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<RoutineItem[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get<{ data: RoutineItem[] }>(
                '/api/v1/branch-class-routine-day-times/teacher-wise-class-routine',
            );
            setData(response.data.data);
        } catch (error) {
            setError(error as Error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to format time from 24-hour to 12-hour format
    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    // Group data by class and subject with corrected day mapping
    const groupedData: GroupedData = data.reduce(
        (acc: GroupedData, item: RoutineItem) => {
            const className = item.subject.class.name;
            const subjectName = item.subject.name.toLowerCase();
            if (!acc[className]) {
                acc[className] = {};
            }
            if (!acc[className][subjectName]) {
                acc[className][subjectName] = {
                    days: Array(7)
                        .fill(null)
                        .map(() => ({ time: '', room: '' })),
                };
            }
            // Map day_no (1=Sunday, 2=Monday, ..., 7=Saturday) to table index (0=Saturday, 1=Sunday, ..., 6=Friday)
            const tableIndex = item.day_no === 7 ? 0 : item.day_no; // day_no: 7 -> index 0, day_no: 1 -> index 1, etc.
            acc[className][subjectName].days[tableIndex] = {
                time: `${formatTime(item.start_time)} - ${formatTime(item.end_time)}`,
                room: item.room.room_name,
            };
            return acc;
        },
        {},
    );

    // Days of the week for table headers
    const days: string[] = [
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
    ];

    return (
        <div className="admin_dashboard">
            <div className="class_schedule_content">
                <table className="table_area">
                    <thead>
                        <tr className="table_head_area">
                            <th className="head_subject_title">Class</th>
                            <th className="head_subject_title">Subjects</th>
                            {days.map((day) => (
                                <th
                                    className="head_day_time_room_title"
                                    style={{ width: 'unset' }}
                                    key={day}
                                >
                                    <span className="head_day_time_room head_day">
                                        {day}
                                    </span>
                                    <span className="head_day_time_room head_time_and_room">
                                        <span className="head_time">time</span>
                                        <span className="head_silash">/</span>
                                        <span className="head_room">room</span>
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedData).map((className) => {
                            const subjects = groupedData[className];
                            const subjectKeys = Object.keys(subjects);
                            return subjectKeys.map((subjectName, index) => (
                                <tr
                                    className="table_body"
                                    key={`${className}-${subjectName}`}
                                >
                                    {index === 0 && (
                                        <td
                                            className="subject"
                                            rowSpan={subjectKeys.length}
                                        >
                                            {className}
                                        </td>
                                    )}
                                    <td className="subject">{subjectName}</td>
                                    {days.map((day, dayIndex) => {
                                        const schedule =
                                            subjects[subjectName].days[
                                                dayIndex
                                            ];
                                        return (
                                            <td
                                                className="class_time_and_room_content"
                                                key={`${className}-${subjectName}-${day}`}
                                            >
                                                {schedule.time &&
                                                schedule.room ? (
                                                    <span className="class_time_and_room">
                                                        <span className="time_rooom class_time">
                                                            {schedule.time}
                                                        </span>
                                                        <span className="time_rooom class_room">
                                                            <span className="room_title">
                                                                room
                                                            </span>
                                                            <span className="dash_title">
                                                                -
                                                            </span>
                                                            <span className="room_number">
                                                                {schedule.room}
                                                            </span>
                                                        </span>
                                                    </span>
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ));
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassRoutine;
