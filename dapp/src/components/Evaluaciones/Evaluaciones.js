import { drizzleReactHooks } from '@drizzle/react-plugin'

import EvaluacionesHead from "./EvaluacionesHead";
import EvaluacionesBody from "./EvaluacionesBody";
import SoloCoordinador from '../Roles/SoloCoordinador';
import SoloAbierta from "../Roles/SoloAbierta";
import NuevaEvaluacion from "./NuevaEvaluacion";


const { useDrizzle } = drizzleReactHooks;

const Evaluaciones = () => {
    const { useCacheCall } = useDrizzle();

    const el = useCacheCall("Asignatura", "evaluacionesLength");

    return (
        <article className="AppEvaluaciones">
            <h2>Evaluaciones</h2>
            <table>
                <EvaluacionesHead />
                <EvaluacionesBody evaluacionesLength={el ?? 0} />
            </table>
            <section>
                <SoloAbierta>
                    <SoloCoordinador>
                        <h3>Funciones del coordinador</h3>
                        <NuevaEvaluacion />
                    </SoloCoordinador>
                </SoloAbierta>
            </section>

        </article>
    );
};

export default Evaluaciones;
