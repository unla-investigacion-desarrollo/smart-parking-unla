import { db } from "@/firebaseConfig";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";

const Reserva = () => {
  const theme = useTheme();
  const { id } = useLocalSearchParams();

  const GreenFlag = () => (
    <MaterialCommunityIcons name="flag" color="#00e676" size={20} />
  );

  const RedFlag = () => (
    <MaterialCommunityIcons name="flag" color="#ff1744" size={20} />
  );
  const [sensor, setSensor] = React.useState(null);

  React.useEffect(() => {
    if (!id) return;

    const docRef = doc(db, "sensors_av", id);

    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setSensor({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        });
      }
    });

    return unsubscribe;
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      {sensor?.image && (
        <Image source={{ uri: sensor.image }} style={styles.image} />
      )}
      <Card style={styles.card}>
        <Card.Title
          title={sensor?.parking_slot_name}
          subtitle={sensor?.parking_slot_group_name}
        />
        <Card.Content>
          <Text variant="bodyMedium">Sensor UID: {sensor?.sensor_uid}</Text>
          <Text variant="bodyMedium">
            estado: {sensor?.status}{" "}
            {sensor?.free ? <GreenFlag /> : <RedFlag />}
          </Text>
          <Text variant="bodyMedium">distancia: {sensor?.distance} cm.</Text>
          <Text variant="bodyMedium">
            actualizado: {sensor?.updated_at.toDate().toLocaleString("es-AR")}
          </Text>
        </Card.Content>
      </Card>
      <Button
        style={styles.button}
        icon="bookmark-check"
        mode="contained"
        onPress={() =>
          alert(
            "TODO: Pagar Reserva por MercadoPago y marcar el lugar como reservado con patente de vehículo de usuario",
          )
        }
      >
        Reservar
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 450,
  },
  card: {
    margin: 10,
  },
  button: {
    margin: 10,
  },
});
export default Reserva;
