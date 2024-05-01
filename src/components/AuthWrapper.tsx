
interface Props {
    FormComponrnt: React.FC;
}


const AuthWrapper = ({FormComponrnt}: Props) => {
    return (
        <div className="w-[100vw] h-[100vh] bg-[#f0f2f5] flex items-center justify-center">
            <div className="w-[70%] h-[70% flex">
                <div className="flex flex-col flex-1 justify-center">
                    <h3 className="text-5xl font-bold text-blue-600 mb-[10px]">Chatio</h3>
                    <span className="text-xl">
                        Connect with people with help of Schat.
                    </span>
                </div>
                <div className="flex flex-col flex-1 justify-center">
                    <FormComponrnt />
                </div>
            </div>
        </div>
    )
};

export default AuthWrapper;
