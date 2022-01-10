import { drizzleReactHooks } from '@drizzle/react-plugin'
import SoloCoordinador from "./Roles/SoloCoordinador";
import SoloOwner from "./Roles/SoloOwner";
import SoloAbierta from "./Roles/SoloAbierta";
import ModificarCoordinador from "./Acciones/ModificarCoordinador";
import AddProfesor from "./Acciones/AddProfesor";
import Cerrar from "./Acciones/Cerrar";


const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const Home = () => {
    const { useCacheCall } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
    const direccion = drizzleState.accounts[0];

    //Obtener variables owner, coordinador y estado.
    let owner = useCacheCall("Asignatura", "owner");
    owner = owner ?? "Desconocido";

    let coordinador = useCacheCall("Asignatura", "coordinador");
    coordinador = coordinador ?? "Desconocido";

    let estadoBool = useCacheCall("Asignatura", "cerrada");
    let estado;
    if (estadoBool === true) {
        estado = "Cerrada";
    } else {
        estado = "Abierta";
    }

    // Código HTML.
    // Bloque principal: información general.
    // División en 3 bloques: SoloAbierta, SoloOwner, SoloCoordinador.
    return (
        <div className='lista'>
            <h2>Home Asignatura</h2>
            <ul>
                <li>La asignatura se encuentra < b >{estado}</b></li>
                <li>El owner es: < b >{owner}</b></li>
                <li>El coordinador de la asignatura es: < b >{coordinador}</b></li>
                <li>Estas conectado con la dirección: < b >{direccion}</b></li>
            </ul>

            <SoloAbierta>
                <SoloOwner>
                    <h2>Funciones del Owner:</h2>
                    <ModificarCoordinador />
                </SoloOwner>
            </SoloAbierta>

            <SoloAbierta>
                <SoloOwner>
                    <AddProfesor/>                    
                </SoloOwner>
            </SoloAbierta>

            <SoloCoordinador>
                <SoloAbierta>
                    <Cerrar/>
                </SoloAbierta>
            </SoloCoordinador>

        </div>
    );


};
export default Home;