import React, {useEffect, useRef, useState} from 'react';
import classNames from "classnames";
import HeatMap from '@uiw/react-heat-map';
import style from "./Stat.module.scss"

const value = [
    {date: '2022/01/11', count: 2},
    {date: '2022/01/12', count: 20},
    {date: '2022/01/13', count: 10},
    ...[...Array(17)].map((_, idx) => ({date: `2022/02/${idx + 10}`, count: idx, content: ''})),
    {date: '2022/04/11', count: 2},
    {date: '2022/05/01', count: 5},
    {date: '2022/05/02', count: 5},
    {date: '2022/05/04', count: 11},
];

const Stat = ({className}) => {
    const innerRef = useRef();
    const [size, setSize] = useState(10);

    useEffect(() => {
        if (!innerRef?.current) return;
        const size = Math.floor(innerRef.current?.getBoundingClientRect().height * 0.08);
        setSize(size);
        console.log(size)
    }, [innerRef.current])

    return (
        <div className={classNames(className)}>
            <div className={classNames(style.StatInner)} ref={innerRef}>
                <HeatMap value={value}
                         startDate={new Date('2022/01/01')}
                         legendRender={() => null}
                         space={size * 0.25}
                         rectSize={size}
                         weekLabels={['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']}
                         monthLabels={['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Нов', 'Дек']}
                         rectProps={{
                             rx: (size * 0.5)
                         }}
                />
            </div>
        </div>
    );
};

export default Stat;