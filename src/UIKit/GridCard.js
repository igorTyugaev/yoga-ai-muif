import React from 'react';
import {Grid, styled, Typography} from "@mui/material";

const Wrapper = styled(Grid)(({theme}) => ({
    // borderRadius: '15px',
    overflow: 'hidden',
    // border: "1px solid #ffab91",
    // backgroundColor: '#fff',
}));

const GridCard = ({children, title, ...props}) => {
    return (
        <Wrapper {...props}>
            {
                title && (
                    <Grid item sx={{marginBottom: '12px'}}>
                        <Typography variant="body1" fontWeight="bold">
                            {title}
                        </Typography>
                    </Grid>
                )
            }
            {children}
        </Wrapper>
    );
};

export default GridCard;