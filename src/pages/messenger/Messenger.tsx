import { MouseEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import Conversation from "../../components/Conversation";
import Message from "../../components/Message";
import Cookies from 'js-cookie';
import { useCreateConversationMutation, useGetAllUsersQuery, useGetConversationsQuery, useGetMessagesQuery, useSendMessageMutation } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { ConversationInterface, MessageInterface, OnlineUser } from "../../types";
import chatIcon from '../../assets/chatIcon.png';
import { format } from "timeago.js";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentMessages, setCurrentMessages } from "../../redux/messagesSlice";
import { Socket, io } from 'socket.io-client';
import Spinner from "../../components/ui/Spinner";
import Header from "../../components/Header";
import User from "../../components/User";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

const Messenger = () => {
    const dispatch = useDispatch();
    const currentMessages = useSelector(selectCurrentMessages);
    const [newMessage, setNewMessage] = useState<string>('');
    const [arrivalMessage, setArrivalMessage] = useState<{ sender: string; text: string, createdAt: number } | null>(null);
    const [currentChat, setCurrentChat] = useState<ConversationInterface | undefined>();
    const [onlineSocketUsers, setOnlineSocketUsers] = useState<OnlineUser[] | undefined>();

    const socket = useRef<Socket | null>();

    const scrollRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

    const userId = Cookies.get('userId');
    const navigate = useNavigate();

    const ConversationsQuery = useGetConversationsQuery(userId || '');
    const AllUsersQuery = useGetAllUsersQuery('');
    const [createConversation,  { isLoading: isNewConversationLoading }] = useCreateConversationMutation({});

    const otherAppUsers = AllUsersQuery.data?.filter(el => el._id !== userId);
    console.log(otherAppUsers, 'otherAppUsers');
    console.log(onlineSocketUsers, 'onlineSocketUsers');

    const onlineAppUsers = otherAppUsers?.filter(user => onlineSocketUsers?.some(socketEl => socketEl.userId === user._id));
    console.log(onlineAppUsers, 'onlineAppUsers');


    useEffect(() => {
        socket.current = io(WS_BASE_URL);
        socket.current.on("getMessage", (data: { senderId: string; text: string }) => {

            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            dispatch(setCurrentMessages([...currentMessages, arrivalMessage]))
    }, [currentChat, arrivalMessage])

    useEffect(() => {
        socket.current?.emit("addUser", userId);

        socket.current?.on('getUsers', (users: OnlineUser[]) => {
            console.log('getUsers', users);

            setOnlineSocketUsers(users);
        });
    }, [userId, socket]);

    const MessagesQuery = useGetMessagesQuery(currentChat?._id || '');

    const [sendMessage,
        {
            isLoading: isNewMessageSending,
            // error: newMessageError
        }
    ] = useSendMessageMutation();

    useEffect(() => {
        if (userId) {
            ConversationsQuery.refetch();
        } else {
            () => navigate('/login');
        }
    }, [navigate, userId]);

    useEffect(() => {
        currentChat && MessagesQuery.refetch()
            .then(res => {
                if ('data' in res) {
                    dispatch(setCurrentMessages(res.data))
                }
        });
    }, [currentChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages, arrivalMessage]);

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const message = {
            sender: userId || '',
            text: newMessage,
            conversationId: currentChat?._id || '',
        };

        const recieverId = currentChat?.members.find(member => member !== userId);

        socket.current?.emit('sendMessage', {
            senderId: userId,
            recieverId,
            text: newMessage,
        });


        sendMessage(message)
            .unwrap()
            .then((res) => dispatch(setCurrentMessages([...currentMessages, res])))
            .then(() => setNewMessage(''))
            .catch(() => toast.error('Message was not sent'));
    };

    const handleInitiateConversation = async (userId: string, receiverId: string) => {
        setCurrentChat(undefined);
        try {
            const result = await createConversation({ userId, receiverId });
            
            // Check if the result contains data or error
            if ('data' in result) {
                // Success case
                const data: ConversationInterface = result.data;
                setCurrentChat(data);
            } else if ('error' in result) {
                // Error case
                toast.error('New conversation creation failed');
                console.error('Error creating conversation:', result.error);
            } else {
                // Unexpected result
                console.error('Unexpected result:', result);
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error('An unexpected error occurred:', error);
        }
    };


    return (
        <div>
            <Header />
            <div className="flex h-[93vh] overflow-auto justify-center bg-neutral-50 ">
                <div className="flex-[3] ">
                    <div className="p-[10px] m-5 rounded-xl">
                    <h2>Active chats:</h2>
                        {ConversationsQuery.isLoading ?
                            <p className="text-center mt-5 text-xl">Loading...</p> :
                            (
                                ConversationsQuery.data?.map((el: ConversationInterface) => (
                                    <div key={el?._id} onClick={() => setCurrentChat(el)}>
                                        <Conversation conversation={el} userId={userId} />
                                    </div>

                                ))
                            )
                        }
                    </div>
                </div>
                {
                    isNewConversationLoading ?
                        <Spinner height={60} width={60} color="blue-200" /> :
                        <div className="flex-[6]">
                            {
                                currentChat ?
                                    (
                                        <div className="bg-white p-[10px] m-5 rounded-xl">
                                            <div className="overflow-auto h-[70vh] p-5 ">

                                                {currentMessages?.map((message: MessageInterface) => {
                                                    if (message) {
                                                        return <div key={message._id} ref={scrollRef}>
                                                            <Message text={message.text} createdAt={format(message.createdAt)} own={message.sender === userId} />
                                                        </div>
                                                    }
                                                    return null;
                                                })}

                                            </div>
                                            <div className="border-t border-separate mt-2" />
                                            <div className="flex justify-center">
                                                <textarea
                                                    className="w-[450px] bg-gray-200 focus:bg-gray-100 rounded-2xl p-3 mt-7 font-light text-black resize-none"
                                                    placeholder="Just start typing ..."
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    value={newMessage}
                                                >
                                                </textarea>
                                                <button
                                                    className="w-[100px] h-[50px] bg-blue-500 active:bg-blue-800 rounded-2xl disabled:bg-gray-500 text-white ml-3 mt-5 self-center"
                                                    onClick={handleSubmit}
                                                    disabled={!newMessage}
                                                >
                                                    {isNewMessageSending ?
                                                        <Spinner height={20} width={20} color="white-200" /> :
                                                        'Send'
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    ) :
                                    <div className=" flex flex-col items-center justify-center bg-white w-[100%] h-[100%] rounded-xl self-center">
                                        <img src={chatIcon} alt='chat' className="h-[150px] w-[150px] self-center mt-[20%]" />
                                        <p className="self-center text-5xl text-gray-300"> Please choose the chat</p>
                                    </div>
                            }

                        </div>
                }
                <div className="flex-[2]">
                    <div className="flex-col">
                        <div className="p-[10px] m-5 rounded-xl">
                            Our Users List:
                            {
                                otherAppUsers?.map(({ username, _id }) => (
                                    <div onClick={() => handleInitiateConversation(userId || '', _id)}>
                                        <User key={_id} name={username} />
                                    </div>
                                ))
                            }
                        </div>
                        <div className="p-[10px] m-5 rounded-xl">
                            Our Online Users List:
                            {onlineAppUsers?.length ? (
                                onlineAppUsers?.map(({ username, _id }) => (
                                    <User isOnline key={_id + 'online'} name={username} />
                                ))
                            ) :
                                <p className="text-gray-400 font-light text-sm mt-5">'Seems like only you is Online:('</p>
                            }
                        </div>
                    </div>

                    <div className="p-[10px] m-5 rounded-xl">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messenger;
