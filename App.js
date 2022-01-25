
import React, {useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage'
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


  useEffect(() => {
    const obtenerPresupuestoStorage = async () => {
        try {
          const presupuestoStorage = await AsyncStorage.getItem('planificador_presupuesto') ?? 0

          if(presupuestoStorage > 0 ) {
            setPresupuesto(presupuestoStorage)
            setIsValidPresupuesto(true)
          }
        } catch (error) {
          console.log(error)
        }
    }
    obtenerPresupuestoStorage()
  }, [])

  useEffect(()=> {   
      if(isValidPresupuesto){
        const guardarPresupuestoStorage = async () =>{
          try{
            await AsyncStorage.setItem('planificador_presupuesto', presupuesto)
          }catch(error){
            console.log(error);
          }
         
        }
        guardarPresupuestoStorage()
    }

  },[isValidPresupuesto])

  useEffect(() => {
    const obtenerGastosStorage = async () => {
      try {
          const gastosStorage = await AsyncStorage.getItem('planificador_gastos') 

          setGastos( gastosStorage ? JSON.parse(gastosStorage) : [] )
      } catch (error) {
          console.log(error)
      }
    }
    obtenerGastosStorage()
}, [])

useEffect(() => {
  const guardarGastosStorage = async () => {
    try {
      await AsyncStorage.setItem('planificador_gastos', JSON.stringify(gastos))
    } catch (error) {
      console.log(error)
    }
  }
  guardarGastosStorage();
}, [gastos])

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

//reiniciar la app o el AsyncStorage
  const resetearApp = () =>{
    Alert.alert(
      'Deseas resetear la app',
      'Esto eliminara presupuesto y gastos',
      [
        {text: 'No', style:'cancel'},
        {text: 'Si, Eliminar', onPress: async () =>{
          try{
            await AsyncStorage.clear()

            setIsValidPresupuesto(false)
            setPresupuesto(0)
            setGastos([])
          } catch(error){
            console.log(error);
          }

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
          resetearApp={resetearApp}
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
