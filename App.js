
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import Header from './src/components/Header'
import ControlPresupuesto from './src/components/ControlPresupuesto'
import NuevoPresupuesto from './src/components/NuevoPresupuesto';


const App = () => {
  const[isValidPresupuesto,setIsValidPresupuesto]= useState(false)
  const [presupuesto, setPresupuesto] = useState(0)

  const handleNuevoPresupuesto = (presupuesto) =>{
    if(Number(presupuesto) > 0){
      setIsValidPresupuesto(true)
      
    }else{
      Alert.alert("Error", "El numero no puede ser 0 o menor", [{ texto: "OK" }]);
    }
  }
  return (
    <View style={styles.contenedor}>
      <View style={styles.header}>
        <Header/>
        {isValidPresupuesto ?
        ( <ControlPresupuesto
          presupuesto={presupuesto}
        />)
        :
        (
            <NuevoPresupuesto
            presupuesto={presupuesto}
            setPresupuesto={setPresupuesto}
            handleNuevoPresupuesto={handleNuevoPresupuesto} 
            />

        )
        
        }

        

      </View>
 
    </View>
  );
};

const styles = StyleSheet.create({
    contenedor:{
      backgroundColor: '#F5F5F5',
      flex: 1
    },
    header:{
      backgroundColor: '#3B82F6',
    },

});

export default App;
