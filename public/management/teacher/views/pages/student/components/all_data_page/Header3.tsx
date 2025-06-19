import React from 'react';
import HeadSearch from './HeadSearch';
import HeadTitle from './HeadTitle';
import HeadRightButtons from './HeadRightButtons';
import HeadRightButtons2 from './HeadRightButtons2';
export interface Props {}

const Header3: React.FC<Props> = (props: Props) => {
    return (
        <>
            <div className="action_bar">
                <div className="navigation">
                    <ul>
                        <li className="search_li">
                            <HeadSearch></HeadSearch>
                        </li>
                    </ul>
                </div>
                <div className="title no_move" id="users_drag">
                    <h2>
                        Student Details
                        {/* {state.is_loading && <span> loading..</span>} */}
                    </h2>
                </div>
                <div className="control">
                    <HeadRightButtons2></HeadRightButtons2>
                </div>
            </div>
        </>
    );
};

export default Header3;
