import React from 'react';
import {Badge, Chip, styled} from '@mui/material';

const Wrapper = styled('div')(({theme}) => ({
    borderRadius: '15px',
    overflow: 'hidden',
    // width: 'calc(38% - 18px)',
    height: '100%',
    border: '1px solid #e0e0e0',
    flex: '0 0 auto',
    cursor: 'pointer',
    position: 'relative',
    transition: '.5s borderColor',
    '& + &': {
        marginLeft: '18px'
    },
    '&:hover': {
        borderColor: '#d84315',
    }
}));

const ContentImg = styled('img')(({theme}) => ({
    objectFit: 'contain',
    objectPosition: 'center',
    width: '100%',
    height: '100%'
}));

const Label = styled(Chip)(({theme}) => ({
    position: 'absolute',
    top: '16px',
    right: '16px',
}));

export default function ProgramCard({img, onClick, isNew = false, ...props}) {
    return (
        <Wrapper onClick={onClick} {...props}>
            <ContentImg
                src={img}
                alt=""/>
            {isNew && <Label label="новинка" color="secondary" variant="outlined" size="small"/>}
        </Wrapper>
    );
}