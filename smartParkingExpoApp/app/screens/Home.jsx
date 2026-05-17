import { db } from "@/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import HomeCard from "../components/HomeCard";
import OSMMap from "../components/OSMMap";

const Home = () => {
  const [sensors, setSensors] = React.useState([]);
  const dbURL = "sensors_av";
  React.useEffect(() => {
    const collectionRef = collection(db, dbURL);
    const q = query(collectionRef, orderBy("updated_at", "desc"));
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      setSensors(querySnapshot.docs.map((doc) => doc.data()));
    });
    return unsuscribe;
  }, []);

  const [selectedSensor, setSelectedSensor] = useState(null);

  const handleCardPress = (sensor) => {
    setSelectedSensor(sensor); // Send sensor info to the map
  };
  return (
    <ScrollView>
      <OSMMap markers={sensors} selectedMarker={selectedSensor} />
      {sensors.map((sensor, idx) => (
        <HomeCard
          key={"homeCard" + idx}
          sensor={sensor}
          someNumber={idx}
          onPress={() => handleCardPress(sensor)}
        />
      ))}
    </ScrollView>
  );
};

export default Home;
