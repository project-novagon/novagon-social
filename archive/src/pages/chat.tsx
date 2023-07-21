import { auth, db } from "../firebase-config";
import { doc, getDoc, Timestamp, collection, serverTimestamp, query, orderBy, DocumentData, Query, addDoc, CollectionReference } from "firebase/firestore";
import { User, onAuthStateChanged } from "firebase/auth";
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { useRef, useState } from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from "react-firebase-hooks/auth";


interface Message {
    id: string;
    text: string;
    sendDate: Timestamp | Date;
    uid: string;
    photoURL: string;
    displayName: string;
  }

interface ChatMessageProps {
    message: Message;
    currentUser: User | null;
  }

function ChatMessage(props: ChatMessageProps) {
    const { message, currentUser } = props;
    const { text, uid, photoURL, displayName } = message;
    const messageClass = uid === currentUser?.uid ? 'sent' : 'received';
  
    return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL ? photoURL : 'https://novagoncdn.netlify.app/img/guest_pfp.png'} alt="User Avatar" className="rounded-full w-9 h.9"/>
        <div>
          <span className="display-name">{displayName}</span>
          <p className="flex-wrap">{text}</p>
        </div>
      </div>
    );
  }

  function ChatRoom() {

    const dummy = useRef< null | HTMLSpanElement>(null);

    const publicChatRef = collection(db, 'public-room');

    const listAllMessages = query(publicChatRef, orderBy('sendDate')) as Query<Message>;

    const [messages] = useCollectionData<Message>(listAllMessages);

    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

  const { uid, photoURL, displayName } = auth.currentUser || {};

  await addDoc(publicChatRef, {
    text: formValue,
    sendDate: serverTimestamp(),
    uid,
    photoURL,
    displayName,
  });
  if (dummy.current != undefined) {
    // 👉️ TypeScript knows that ref is not null here
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  
      setFormValue('');
    };
  
    return (
      <div className="flex flex-col w-screen h-screen p-6 md:p-0">
        <main className="block space-y-4">
          <h2 className="text-2xl bg-black/50 p-5 rounded-md shadow-lg sticky top-5 backdrop-blur before:content-['_#']">public-room</h2>
          {messages &&
            messages.map((message: Message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUser={auth.currentUser} // idk what to put here yet
              />
            ))}
            <span ref={dummy}></span>
        </main>

          <form onSubmit={sendMessage} className="sticky flex items-center justify-center bottom-20">
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Type your message..."
            className="h-16 px-4 m-1 text-lg leading-3 border-none rounded-md shadow-sm opacity-100 w-96 font-albertsans ring-4 bg-zinc-300 dark:bg-zinc-500 ring-zinc-400 dark:ring-zinc-600 ring-inset focus:ring-zinc-500 focus:ring-4 dark:focus:ring-zinc-700 dark:focus:ring-4"
          />
          <button type="submit" className="w-16 h-16 px-5 transition-all bg-violet-500 rounded-md shadow-sm dark:bg-zinc-700 hover:shadow-lg">
            <PaperAirplaneIcon className="send-icon" />
            <p className="sr-only">send</p>
          </button>
        </form>

      </div>
    );
  }

export default ChatRoom;