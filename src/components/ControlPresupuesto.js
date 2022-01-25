import React, {useState,useEffect} from 'react';
import { Text,View,Image,StyleSheet } from 'react-native';
import globalStyles from '../styles';
import { formatearCantidad}   from '../helpers';
import CircularProgress from 'react-native-circular-progress-indicator'


const ControlPresupuesto =({presupuesto, gastos}) => {
    const[disponible, setDisponible] = useState(0)
    const [gastado, setGastado] = useState(0)

    useEffect(() => {
        const totalGastado = gastos.reduce( (total, gastos) => 
        Number(gastos.cantidad)+ total, 0
        )
        const totalDisponible = presupuesto - totalGastado
        setDisponible(totalDisponible)
        setGastado(totalGastado)
    },[gastos])
  return (
      <View style={styles.contenedor}>
          <View style={styles.centrarGrafica}>
             <CircularProgress
             value={50}
             />
          </View>
            <View style={styles.contenedorTexto}>
                <Text style={styles.valor}>
                    <Text style={styles.label
                    }>Presupuesto:{''}</Text>
                    
                    {formatearCantidad(presupuesto)}
                </Text>
                
                <Text style={styles.valor}>
                        <Text style={styles.label}>Disponible:{''}</Text>
                        
                        {formatearCantidad(disponible)}
                </Text>

                <Text style={styles.valor}>
                        <Text style={styles.label}>Gastado:{''}</Text>
                        
                        {formatearCantidad(gastado)}
                </Text>
            </View>
         

      </View>

    )
}
const styles = StyleSheet.create({
    contenedor:{
       ...globalStyles.contenedor
    },
    centrarGrafica:{
        alignItems: 'center',
    },
    imagen:{
        width: 250,
        height: 250,
    },
    letras:{
        color: '#000000'
    },
    contenedorTexto:{
        marginTop: 50
    },
    valor:{
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
        color: '#000'
    },
    label:{
        fontWeight: '700',
        color: '#3B82F6',
    },
})

export default  ControlPresupuesto
