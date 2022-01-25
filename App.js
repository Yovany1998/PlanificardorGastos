
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
import FiltroGasto from './src/components/FiltroGasto';
import ListadoGastos from './src/components/ListadoGastos';


const App = () => {
  const[isValidPresupuesto,setIsValidPresupuesto]= useState(false)
  const [presupuesto, setPresupuesto] = useState(0)
  const [gastos,setGastos] = useState([])
  const [modal, setModal]= useState(false)
  const [gasto, setGasto] = useState({})
  const [filtro ,setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState('')


  const handleNuevoPresupuesto = (presupuesto) =>{
    if(Number(presupuesto) > 0){
      setIsValidPresupuesto(true)
      
    }else{
      Alert.alert("Error", "El numero no puede ser 0 o menor", [{ texto: "OK" }]);
    }
  }

  const handleGasto = gasto =>{
   if([gasto.nombre, gasto.categoria, gasto.cantidad].includes('') ){
    Alert.alert(
      "Error",
      "Todos los campos son obligatorios",
    )
    return
   }

   if(gasto.id){
    //Edición
    const gastosActualizados = gastos.map(gastoState =>
        gastoState.id === gasto.id? gasto : gastoState)

        setGastos(gastosActualizados)

   }else{
   //añadir el nuevo gasto
   gasto.id = generarId()
   gasto.fecha = Date.now()
   setGastos([...gastos, gasto])
   }

   setModal(!modal)
  }


const  eliminarGasto = id =>{
  Alert.alert(
    '¿Deseas eliminar este gasto',
    'Un gasto eliminado no se puede recuperar',
    [
      {text: 'No', style: 'cancel'},
      {text: 'Si,Eliminar', onPress: () =>{
      const gastosActualizados = gastos.filter(gastoState =>
        gastoState.id !== id)
        setGastos(gastosActualizados)
        setModal(!modal)
        setGasto({})
      }}

    ]
  )
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
        // Esto es un fragmen para colocar mas de 1 componente
        <>
            <FiltroGasto 
            setFiltro = {setFiltro}
            filtro = {filtro}
            gastos={gastos}
            setGastosFiltrados={setGastosFiltrados}
            />
          
          <ListadoGastos
            gastos={gastos}
            setModal={setModal}
            setGasto={setGasto}
            filtro ={filtro}
            gastosFiltrados ={gastosFiltrados}
          />

        </>
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
              gasto={gasto}
              setGasto={setGasto}
              eliminarGasto={eliminarGasto}
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
