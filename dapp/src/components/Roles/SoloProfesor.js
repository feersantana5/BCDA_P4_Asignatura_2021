import { drizzleReactHooks } from '@drizzle/react-plugin'
const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const SoloProfesor = ({ children }) => {
    const { useCacheCall } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
    const addr = drizzleState.accounts[0];
    const existeProfe = useCacheCall("Asignatura", "datosProfesor", addr);

    if (existeProfe) {
        return <>
            {children}
        </>
    } else {
        return <></>
    }
};

export default SoloProfesor;