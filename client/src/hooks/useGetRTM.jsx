import { setMessages } from "@/redux/chatSlice";
import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../App";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { messages } = useSelector(store => store.chat);
    const socket = useContext(SocketContext);
    useEffect(() => {
        if (!socket) return;
        socket.on('newMessage', (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
        });
        return () => {
            socket.off('newMessage');
        };
    }, [messages, socket, dispatch]);
};
export default useGetRTM;