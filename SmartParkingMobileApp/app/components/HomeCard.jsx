import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="map-marker" />

export default function MyCardHome({sensor}){

  return(
    <Card key={sensor.id}>
    <Card.Title title={sensor.sensor_id} subtitle="Card Subtitle" left={LeftContent} />
    <Card.Content>
      <Text variant="bodyMedium">{sensor.name}</Text>
      <Text variant="bodyMedium">is free: {sensor.free}</Text>
      <Text variant="bodyMedium">status: {sensor.status}</Text>
      <Text variant="bodyMedium">distance: {sensor.distance}</Text>
      <Text variant="bodyMedium">last updated: {new Date(sensor.updated_at).toLocaleString()}</Text>
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