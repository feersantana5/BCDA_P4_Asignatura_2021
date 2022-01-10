import MisDatos from "./MisDatos";
import MisNotas from "./MisNotas";
import SoloAlumnos from "../Roles/SoloAlumnos";


const MisCosas = () => {

    return <section className="AppMisCosas">
        <h2>Mis Cosas</h2>
        <MisDatos />
        <SoloAlumnos>
            <MisNotas />
        </SoloAlumnos>
    </section>;
}

export default MisCosas;

