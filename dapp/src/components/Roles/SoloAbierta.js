import { drizzleReactHooks } from '@drizzle/react-plugin'
const { useDrizzle } = drizzleReactHooks;

const SoloAbierta = ({ children }) => {
    let { useCacheCall } = useDrizzle();
    let estadoBool = useCacheCall("Asignatura", "cerrada");

    
    if (estadoBool === true) {
        return <></>;
    } else {
        return <>
            {children}
        </>
    }

};

export default SoloAbierta;