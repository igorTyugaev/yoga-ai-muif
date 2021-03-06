import React, { Component } from "react";

import PropTypes from "prop-types";

import {
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";

import { Link as LinkIcon, LinkOff as LinkOffIcon } from "@mui/icons-material";

import authProviders from "../../data/auth-providers";

import UserService from "../../services/UserService";

class LinksTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      performingAction: false,
    };
  }

  linkAuthProvider = (authProvider) => {
    this.setState(
      {
        performingAction: true,
      },
      () => {
        UserService
          .linkAuthProvider(authProvider)
          .then((value) => {
            this.props.openSnackbar(`${authProvider.name} привязан`, 5);
          })
          .catch((reason) => {
            const code = reason.code;
            const message = reason.message;

            switch (code) {
              default:
                this.props.openSnackbar(message);
                return;
            }
          })
          .finally(() => {
            this.setState({
              performingAction: false,
            });
          });
      }
    );
  };

  unlinkAuthProvider = (authProvider) => {
    this.setState(
      {
        performingAction: true,
      },
      () => {
        UserService
          .unlinkAuthProvider(authProvider.id)
          .then((value) => {
            this.props.openSnackbar(`${authProvider.name} отвязан`, 4);
          })
          .catch((reason) => {
            const code = reason.code;
            const message = reason.message;

            switch (code) {
              default:
                this.props.openSnackbar(message);
                return;
            }
          })
          .finally(() => {
            this.setState({
              performingAction: false,
            });
          });
      }
    );
  };

  render() {
    // Properties
    const { theme } = this.props;

    const { performingAction } = this.state;

    return (
      <DialogContent>
        <List disablePadding>
          {authProviders.map((authProvider) => {
            const authProviderData = UserService.authProviderData(
              authProvider.id
            );
            let identifier = null;

            if (authProviderData) {
              const displayName = authProviderData.displayName;
              const emailAddress = authProviderData.email;
              const phoneNumber = authProviderData.phoneNumber;

              identifier = displayName || emailAddress || phoneNumber;
            }

            return (
              <ListItem key={authProvider.id}>
                <ListItemIcon>
                  <Box color={theme.dark ? null : authProvider.color}>
                    {authProvider.icon}
                  </Box>
                </ListItemIcon>

                {authProviderData && (
                  <ListItemText
                    primary={authProvider.name}
                    secondary={identifier}
                  />
                )}

                {!authProviderData && (
                  <ListItemText primary={authProvider.name} />
                )}

                <ListItemSecondaryAction>
                  {authProviderData && (
                    <Tooltip title="Unlink">
                      <div>
                        <IconButton
                          disabled={performingAction}
                          onClick={() => this.unlinkAuthProvider(authProvider)}
                          size="large">
                          <LinkOffIcon />
                        </IconButton>
                      </div>
                    </Tooltip>
                  )}

                  {!authProviderData && (
                    <Tooltip title="Link">
                      <div>
                        <IconButton
                          disabled={performingAction}
                          onClick={() => this.linkAuthProvider(authProvider)}
                          size="large">
                          <LinkIcon />
                        </IconButton>
                      </div>
                    </Tooltip>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    );
  }
}

LinksTab.propTypes = {
  // Properties
  theme: PropTypes.object.isRequired,

  // Functions
  openSnackbar: PropTypes.func.isRequired,
};

export default LinksTab;
