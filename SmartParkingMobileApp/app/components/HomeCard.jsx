import * as React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Avatar, Card, Icon, Text } from "react-native-paper";

const IconoLibre = (props) => (
  <Avatar.Icon
    {...props}
    icon="map-marker"
    color="#00e676"
    backgroundColor="transparent"
    size="60"
  />
);
const IconoOcupado = (props) => (
  <Avatar.Icon
    {...props}
    icon="map-marker"
    color="#ff1744"
    backgroundColor="transparent"
    size="60"
  />
);

const GreenFlag = () => <Icon source="flag" color="#00e676" size={20} />;
const RedFlag = () => <Icon source="flag" color="#ff1744" size={20} />;

export default function MyCardHome({ sensor, index, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Card key={sensor.id} style={styles.container}>
        <Card.Title
          title={"Slot id " + sensor.id + " Name " + sensor.name}
          subtitle={" Slot Group " + sensor.parking_slot_group_id}
          left={sensor.free ? IconoLibre : IconoOcupado}
        />
        <Card.Cover
          source={{
            uri: "http://129.212.182.8:5005/static/images/est" + index + ".png",
          }}
        />
        <Card.Content>
          <Text variant="bodyMedium">Sensor ID: {sensor.sensor_id}</Text>
          <Text variant="bodyMedium">
            is free: {sensor.free} {sensor.free ? <GreenFlag /> : <RedFlag />}
          </Text>
          <Text variant="bodyMedium">status: {sensor.status}</Text>
          <Text variant="bodyMedium">distance: {sensor.distance}</Text>
          <Text variant="bodyMedium">
            last updated: {sensor.updated_at.seconds}
          </Text>
        </Card.Content>

        {/*<Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>*/}
      </Card>
    </Pressable>
  );
}

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
    marginTop: 20,
  },
});
