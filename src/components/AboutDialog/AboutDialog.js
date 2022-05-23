import React from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Tooltip,
    IconButton,
    List,
    ListItem,
    ListItemText, styled,
} from "@mui/material";
import {Close as CloseIcon} from "@mui/icons-material";

const CloseBtn = styled(IconButton)(({theme}) => ({
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
}));

function AboutDialog(props) {
    const dialogProps = props.dialogProps;
    const user = props.user;
    const version = process.env.REACT_APP_VERSION;

    if (!user && !version) {
        return null;
    }

    return (
        <Dialog fullWidth maxWidth="xs" {...dialogProps}>
            <DialogTitle>
                <Typography variant="span">
                    {process.env.REACT_APP_TITLE}
                </Typography>

                <Tooltip title="Закрыть">
                    <CloseBtn onClick={dialogProps.onClose}
                              size="large">
                        <CloseIcon/>
                    </CloseBtn>
                </Tooltip>
            </DialogTitle>

            <DialogContent>
                <List disablePadding>
                    {version && (
                        <ListItem>
                            <ListItemText primary="Version" secondary={version}/>
                        </ListItem>
                    )}

                    {user && (
                        <ListItem>
                            <ListItemText primary="UID" secondary={user.uid}/>
                        </ListItem>
                    )}
                </List>
            </DialogContent>
        </Dialog>
    );
}

AboutDialog.propTypes = {
    dialogProps: PropTypes.object.isRequired,
    user: PropTypes.object,
};

export default AboutDialog;
