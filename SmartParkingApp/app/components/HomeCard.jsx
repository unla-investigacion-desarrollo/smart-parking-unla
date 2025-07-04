import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const LeftContent = props => <Avatar.Icon {...props} icon="map-marker" />

export default function MyCardHome({sensor}){

  return(
    <Card>
    <Card.Title title={sensor.sensor_id} subtitle="Card Subtitle" left={LeftContent} />
    <Card.Content>
      <Text variant="bodyMedium">{sensor.name}</Text>
      <Text variant="bodyMedium">is free: {sensor.free}</Text>
      <Text variant="bodyMedium">last updated: {sensor.updated_at.toDate().toLocaleString()}</Text>
    </Card.Content>
    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
)};

const styles = StyleSheet.create({
  container: {    
    flexDirection: 'row',
    
    marginBottom: 20,
    alignItems: 'flex-start', 
    backgroundColor: "white",
  },
  containerText: {
    flex: 1,
    marginLeft: 2,
    marginRight: 2,
  },
  containerButton: {    
    backgroundColor: "white",
    borderColor: "white",
    borderRadius: 0,
    marginTop:20,
  },
})