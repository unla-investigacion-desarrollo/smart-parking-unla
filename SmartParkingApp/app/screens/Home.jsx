import React from 'react';
import {ScrollView } from 'react-native';
import { db } from '../../firebaseConfig';
import HomeCard from "../components/HomeCard";
import { collection,onSnapshot,query,orderBy } from "firebase/firestore";

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
        <ScrollView>

        {sensors.map((sensor,idx) => ( <HomeCard key={"homeCard"+idx} sensor={sensor}/> ))}
        </ScrollView>
		
);

}

export default Home;