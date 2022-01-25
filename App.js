
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import Header from './src/components/Header'
import ControlPresupuesto from './src/components/ControlPresupuesto'
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import FormularioGasto from './src/components/FormularioGasto';
import { generarId } from './src/helpers';
import ListadoGastos from './src/components/ListadoGastos';

const App = () => {
  const[isValidPresupuesto,setIsValidPresupuesto]= useState(false)
  const [presupuesto, setPresupuesto] = useState(0)
const [gastos,setGastos] = useState([])
const [modal, setModal]= useState(false)


  const handleNuevoPresupuesto = (presupuesto) =>{
    if(Number(presupuesto) > 0){
      setIsValidPresupuesto(true)
      
    }else{
      Alert.alert("Error", "El numero no puede ser 0 o menor", [{ texto: "OK" }]);
    }
  }

  const handleGasto = gasto =>{
   if(Object.values(gasto).includes('')){
    Alert.alert(
      "Error",
      "Todos los campos son obligatorios",
    )
    return
   }
   //añadir el nuevo gasto
   gasto.id = generarId()
   gasto.fecha = Date.now()

   setGastos([...gastos, gasto])
   setModal(!modal)
  }

  return (
    <View style={styles.contenedor}>
      <ScrollView>
      <View style={styles.header}>
        <Header/>
        {isValidPresupuesto ?
        ( 
          // <FormularioGasto/>
        <ControlPresupuesto
          presupuesto={presupuesto}
          gastos={gastos}
        />
        
        )
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
      
      {isValidPresupuesto && (
       <ListadoGastos
         gastos={gastos}
       />

     )}

</ScrollView>
{modal && (
            <Modal
            animationType='slide'
            visible={modal}
            onRequestClose={() =>{
              setModal(!modal)

            }}
            >
              <FormularioGasto
              setModal={setModal}
              handleGasto={handleGasto}
              />
              </Modal>     
     
      )}

      {isValidPresupuesto && (
        <Pressable
          style={styles.pressable}
          onPress={() => setModal(!modal)}
        >
          <Image
              style={styles.imagen}
              source={require('./src/img/nuevo-gasto.png')}
          />
        </Pressable>
      ) }

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
      minHeight: 400
    },
    imagen: {
      width: 60,
      height: 60
    }, 
    pressable:{ 
      width: 60,
      height: 60, 
      position: 'absolute',
      bottom: 40,
      right: 30
   
    }

});

export default App;
