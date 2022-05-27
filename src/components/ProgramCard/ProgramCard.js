import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea} from '@mui/material';

export default function ProgramCard({img, desc, title}) {
    return (
        <Card sx={{marginBottom: '24px', overflow: 'visible'}}>
            <CardActionArea>
                <CardMedia sx={{objectPosition: 'top center', objectFit: "cover"}}
                           component="img"
                           image={img}
                           alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h3">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {desc}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}