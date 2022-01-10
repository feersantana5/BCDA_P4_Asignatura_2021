import { drizzleReactHooks } from '@drizzle/react-plugin'

function LogIn() {

    const { useDrizzle, useDrizzleState } = drizzleReactHooks;
    const { useCacheCall } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const direccion = drizzleState.accounts[0];
    const owner = useCacheCall("Asignatura", "owner");
    const coordinador = useCacheCall("Asignatura", "coordinador");
    const alumno = useCacheCall("Asignatura", "datosAlumno", direccion);
    const profesor = useCacheCall("Asignatura", "datosProfesor", direccion);

    let texto;
    let tipo;

    if (direccion === owner) {
        texto = "Owner";
    } else if (direccion === coordinador) {
        texto = "Coordinador";
    } else if (profesor) {
        texto = profesor;
        tipo = "Profesor - ";
    } else if (alumno?.nombre) {
        texto = alumno?.nombre;
        tipo = "Alumn@ - ";
    } else {
        tipo = "Alumn@ no matriculado";
    }

    return (
        <>
            <div className="HeaderLogin">
                    <em>Conectado como: <b>{tipo}{texto}</b></em>
                    <p className="lil"><em>{direccion}</em></p>
            </div>

        </>
    );
}

export default LogIn;