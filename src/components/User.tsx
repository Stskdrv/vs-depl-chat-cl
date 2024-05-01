import personImg from '../assets/person.png';

interface Props {
    isOnline?: boolean;
    name: string;
}

const User = ({isOnline, name}: Props) => {
    return (
        <div className="">
            <div className="">
                <div className="flex items-center gap-1 m-2 cursor-pointer hover:bg-gray-100 rounded-xl p-1 relative ">
                    <img className="h-[32px] border-2 border-grey-600 rounded-full object-cover" src={personImg} alt="preson" />
                    {isOnline && <div className="absolute w-2 h-2 rounded-full top-2 left-1 bg-green-400" title='user online' />}
                    <div className="font-normal">
                        {name}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default User;