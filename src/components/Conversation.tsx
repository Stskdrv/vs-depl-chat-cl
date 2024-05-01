import personImg from '../assets/person.png';
import { ConversationInterface } from '../types';
import { useGetUserQuery } from '../services/api';

const Conversation = ({ conversation, userId }: { conversation: ConversationInterface, userId: string | undefined }) => {
  const friendId = conversation.members.find((el) => el !== userId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const UserQuery = useGetUserQuery(friendId || '');

  return (
    <div className="flex items-center gap-3 m-2 cursor-pointer hover:bg-gray-100 rounded-xl p-2 ">
      {
        UserQuery.isLoading ?
          <p>Loading...</p> :
          (<>
            <img className="h-[50px] border-2 border-grey-600 rounded-full object-cover" src={personImg} alt="preson" />
            <span className="font-normal">{UserQuery.data?.username}</span>
          </>)
      }

    </div>
  )
};

export default Conversation;
