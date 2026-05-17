import * as React from 'react';
import { Appbar,useTheme, Avatar } from 'react-native-paper';

const Header = () => {
  const theme = useTheme();
  return(
  <Appbar.Header style={{ backgroundColor: theme.colors.primary }} elevated='true'>
    <Appbar.Content title="Smart Parking UnLa" color="white"/>
    <Avatar.Icon size={36} icon="account-circle" />
  </Appbar.Header>
  )
};

export default Header;