import { drizzleReactHooks } from '@drizzle/react-plugin'
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const NoMatriculados = ({ children }) => {
    const { useCacheCall } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
    const addr = drizzleState.accounts[0];
    const existeAlumno = useCacheCall("Asignatura", "datosAlumno", addr);
    const esProfe = useCacheCall("Asignatura", "datosProfesor", addr);
    const coordinador = useCacheCall("Asignatura", "coordinador");
    const owner = useCacheCall("Asignatura", "owner");

    if (addr === coordinador || addr === owner || existeAlumno?.nombre || esProfe) {
        return <></>
    } else {
        return <>
            {children}
        </>
    }
};
export default NoMatriculados;