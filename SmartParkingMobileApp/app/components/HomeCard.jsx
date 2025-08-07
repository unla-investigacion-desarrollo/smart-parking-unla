import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="map-marker" />

export default function MyCardHome({sensor}){

  return(
    <Card key={sensor.id} style={styles.container}>
    <Card.Title title={"Slot id " + sensor.id + " Name " + sensor.name } subtitle={" Slot Group " + sensor.parking_slot_group_id} left={LeftContent} />
    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Content>
      <Text variant="bodyMedium">Sensor ID: {sensor.sensor_id}</Text>
      <Text variant="bodyMedium">is free: {sensor.free}</Text>
      <Text variant="bodyMedium">status: {sensor.status}</Text>
      <Text variant="bodyMedium">distance: {sensor.distance}</Text>
      <Text variant="bodyMedium">last updated: {new Date(sensor.updated_at).toLocaleString()}</Text>
    </Card.Content>
    
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
)};

const styles = StyleSheet.create({
  container: {    
    margin: 10,
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