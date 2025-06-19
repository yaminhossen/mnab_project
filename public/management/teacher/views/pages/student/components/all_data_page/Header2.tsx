import React from 'react';
import HeadSearch from './HeadSearch';
import HeadTitle from './HeadTitle';
import HeadRightButtons from './HeadRightButtons';
import HeadSearch2 from './HeadSearch2';
import { Link } from 'react-router-dom';
import setup from '../../config/setup';
import HeadRightButtons2 from './HeadRightButtons2';
interface Props {
    id: string | undefined;
}

const Header2: React.FC<Props> = (props: Props) => {
    return (
        <>
            <div className="action_bar">
                <div className="navigation">
                    <ul>
                        <li className="search_li">
                            <HeadSearch2 id={props.id}></HeadSearch2>
                        </li>
                    </ul>
                </div>
                <HeadTitle></HeadTitle>
                <div className="control">
                    <HeadRightButtons></HeadRightButtons>
                </div>
            </div>
        </>
    );
};

export default Header2;
