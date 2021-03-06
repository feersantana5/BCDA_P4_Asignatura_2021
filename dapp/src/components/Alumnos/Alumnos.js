import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useParams, Link } from "react-router-dom";

import AlumnosHead from "./AlumnosHead";
import AlumnosBody from "./AlumnosBody";
import NoMatriculados from '../Roles/NoMatriculados';
import SoloAbierta from '../Roles/SoloAbierta';
import Matricular from "./Matricular";

const { useDrizzle } = drizzleReactHooks;

export const Alumnos = () => {
    const { useCacheCall } = useDrizzle();

    const ml = useCacheCall("Asignatura", "matriculasLength") || 0;

    return (
        <section className="AppAlumnos">
            <h2>Alumnos</h2>
            <table>
                <AlumnosHead />
                <AlumnosBody matriculasLength={ml || 0} />
            </table>
            <SoloAbierta>
                <NoMatriculados>
                <h3>AutomatricĂșlate!</h3>
                    <Matricular />
                </NoMatriculados>
            </SoloAbierta>
        </section>
    );
};

//QUE UTILIDAD TIENE ESTO???
export const Alumno = () => {
    const { useCacheCall } = useDrizzle();

    let { addr } = useParams();

    const datos = useCacheCall("Asignatura", "datosAlumno", addr);

    return <>
        <header className="AppAlumno">
            <h2>Alumno</h2>
        </header>
        <ul>
            <li><b>Nombre:</b> {datos?.nombre ?? "Desconocido"}</li>
            <li><b>DNI:</b> {datos?.dni ?? "Desconocido"}</li>
            <li><b>Email:</b> {datos?.email ?? "Desconocido"}</li>
            <li><b>Address:</b> {addr}</li>
        </ul>
        <Link to="/alumnos">Volver</Link>
    </>
};
