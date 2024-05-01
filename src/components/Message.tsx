import personImg from '../assets/person.png';

const Message = ({own, text, createdAt}: {own?: boolean, text: string, createdAt: string}) => {
    return (
        <div className={`${own ? 'flex justify-end' : ''}`}>
            <div className='flex gap-3 rounded-xl p-2 max-w-[350px]'>
                {! own && <img className="h-[50px] border-2 border-grey-600 mt-5 rounded-full object-cover" src={personImg} alt="preson" />}
                <div>
                    <p className={`flex-wrap ${ own ? 'bg-gray-200  text-black': 'bg-blue-500  text-white'} font-[300] rounded-3xl mt-2 p-2`}>
                       {text}
                    </p>
                    <div className="font-light ">
                       {createdAt}
                    </div>
                </div>
                {own && <img className="h-[50px] border-2 border-grey-600 mt-5 rounded-full object-cover" src={personImg} alt="preson" />}
            </div>
        </div>

    )
}

export default Message;