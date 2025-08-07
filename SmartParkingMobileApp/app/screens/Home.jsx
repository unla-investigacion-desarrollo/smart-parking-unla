import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { db } from '../../firebaseConfig';
import HomeCard from "../components/HomeCard";

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
    
	return(
	<SafeAreaView>
        <ScrollView contentContainerStyle={{ paddingBottom: 300 }} >
        {sensors.map((sensor,idx) => ( <HomeCard key={"homeCard"+idx} sensor={sensor}/> ))}
        </ScrollView>
	</SafeAreaView>
);
}

export default Home;