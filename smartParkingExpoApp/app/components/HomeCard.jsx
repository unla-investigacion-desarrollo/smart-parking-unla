import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
const IconoLibre = (props) => (
  <Avatar.Icon
    {...props}
    icon="map-marker"
    color="#00e676"
    backgroundColor="transparent"
    size={60}
  />
);
const IconoOcupado = (props) => (
  <Avatar.Icon
    {...props}
    icon="map-marker"
    color="#ff1744"
    backgroundColor="transparent"
    size={60}
  />
);

const GreenFlag = () => (
  <MaterialCommunityIcons name="flag" color="#00e676" size={20} />
);

const RedFlag = () => (
  <MaterialCommunityIcons name="flag" color="#ff1744" size={20} />
);

export default function HomeCard({ sensor, someNumber, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Card key={sensor.id} style={styles.container}>
        <Card.Title
          title={sensor.parking_slot_name}
          subtitle={" Estacionamiento: " + sensor.parking_slot_group_name}
          left={sensor.free ? IconoLibre : IconoOcupado}
        />
        <Card.Cover
          source={{
            uri: sensor.image,
          }}
        />
        <Card.Content>
          <Text variant="bodyMedium">Sensor UID: {sensor.sensor_uid}</Text>
          <Text variant="bodyMedium">
            estado: {sensor.status} {sensor.free ? <GreenFlag /> : <RedFlag />}
          </Text>
          <Text variant="bodyMedium">distancia: {sensor.distance} cm.</Text>
          <Text variant="bodyMedium">
            actualizado: {sensor.updated_at.toDate().toLocaleString("es-AR")}
          </Text>
        </Card.Content>
        <Card.Actions>
          {sensor.free ? (
            <Button
              onPress={() =>
                router.push({
                  pathname: "/screens/reserva",
                  params: { id: sensor.sensor_uid },
                })
              }
            >
              Reservar
            </Button>
          ) : null}
        </Card.Actions>
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
