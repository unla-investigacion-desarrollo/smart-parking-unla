import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { db } from '../../firebaseConfig';
import HomeCard from "../components/HomeCard";
import OSMMap from "../components/OSMMap";

const Home = () => {
    const [sensors, setSensors] = React.useState([]);
    const dbURL = "sensors_av" ;
    React.useEffect(() => {
	    const collectionRef = collection(db, dbURL);
	    const q = query(collectionRef, orderBy("updated_at", "desc"));
        const unsuscribe = onSnapshot(q, querySnapshot => {
			setSensors(
				querySnapshot.docs.map(doc => (
					doc.data()
					))
				)
		});
		return unsuscribe;
	},[]);
	
	const [selectedSensor, setSelectedSensor] = useState(null);

	const handleCardPress = (sensor) => {
		setSelectedSensor(sensor); // Send sensor info to the map
	};
	return(
	<SafeAreaView>
        <ScrollView contentContainerStyle={{ paddingBottom: 300,backgroundColor: '#fff' }} bounces={false}overScrollMode="never">
		<OSMMap markers={sensors} selectedMarker={selectedSensor}/>
        {sensors.map((sensor,idx) => ( 
			<HomeCard key={"homeCard"+idx} 
				sensor={sensor} 
				index={idx} 
				onPress={() => handleCardPress(sensor)}
				/> 
			))}
        </ScrollView>
	</SafeAreaView>
);
}

export default Home;