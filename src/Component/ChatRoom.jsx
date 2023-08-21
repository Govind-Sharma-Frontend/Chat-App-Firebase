import { useEffect, useRef, useState } from "react";
// import Paper from "@mui/material/Paper";
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemText from "@mui/material/ListItemText";
// import ListItemAvatar from "@mui/material/ListItemAvatar";
// import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

function UsersComponent(props) {
  const handleToggle = (username, userId, profileImage) => {
    props?.setReceiverData({
      username: username,
      profileImage:profileImage,
      userId: userId,
    });
    props.navigate(`/dashboard`);
  };

  return (
    <List
      dense
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      {props.users?.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        if (props.currentUserId !== value.userId)
          return (
            <ListItem key={value.userId} disablePadding>
              <ListItemButton
                onClick={() => {
                  handleToggle(value.username, value.userId, value.profileImage);
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={`${value.username}`}
                    src={`${value.profileImage ?? value.profileImage }.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={`${value.username}`} />
              </ListItemButton>
            </ListItem>
          );
      })}
    </List>
  );
}
UsersComponent.propTypes = {
  // children: PropTypes.element.isRequired,
  setReceiverData: PropTypes.any,
  navigate: PropTypes.any,
  currentUserId: PropTypes.any,
  users: PropTypes.any,
  scrollToBottom: PropTypes.func
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  // window: PropTypes.func,
};
export default function Home() {
  const [users, setUsers] = useState([]);
  const messagesContainerRef = useRef(null);
  const [receiverData, setReceiverData] = useState(null);
  const [chatMessage, setChatMessage] = useState("");

  const [allMessages, setAllMessages] = useState([]);
console.log('allMessages',allMessages);
  const user = auth.currentUser;
  

  const navigate = useNavigate();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      console.log('messagesContainerRef.current',messagesContainerRef.current);
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (receiverData) {
      const unsub = onSnapshot(
        query(
          collection(
            db,
            "users",
            user?.uid,
            "chatUsers",
            receiverData?.userId,
            "messages"
          ),
          orderBy("timestamp")
        ),
        (snapshot) => {
          scrollToBottom();
          setAllMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              messages: doc.data(),
            }))
          );
        }
      );
      
      return unsub;
    }
  }, [receiverData?.userId]);


  useEffect(()=>{
    scrollToBottom();
  } , [allMessages])

  const sendMessage = async () => {
    try {
      if (user && receiverData) {
        await addDoc(
          collection(
            db,
            "users",
            user.uid,
            "chatUsers",
            receiverData.userId,
            "messages"
          ),
          {
            username: user.displayName,
            messageUserId: user.uid,
            message: chatMessage,
            timestamp: new Date(),
          }
        );

        await addDoc(
          collection(
            db,
            "users",
            receiverData.userId,
            "chatUsers",
            user.uid,
            "messages"
          ),
          {
            username: user.displayName,
            messageUserId: user.uid,
            message: chatMessage,
            timestamp: new Date(),
          }
        );
        scrollToBottom();
      }
    } catch (error) {
      console.log(error);
    }
    setChatMessage("");
  };

  return (
    <div style={root}>
      <Box style={left}>
        <div
          style={{
            display: "flex",
            padding: 5,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display={'flex'} alignItems={'center'} gap={1}>
           <Avatar
           sx={{ width: 40, height: 40 }}
                    alt={`${user?.displayName}`}
                    src={`${user?.profileImage ?? user?.displayName }.jpg`}
                  />
          <h4 style={{ margin: 0 }}>{user?.displayName} </h4>
          </Box>
          <Button
            color="secondary"
            onClick={() => {
              auth.signOut();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
        <Divider />
        <div style={{ overflowY: "auto" }}>
          <UsersComponent
            users={users}
            setReceiverData={setReceiverData}
            scrollToBottom={scrollToBottom}
            navigate={navigate}
            currentUserId={user?.uid}
          />
        </div>
      </Box>

      <Box style={right}>
        <Box display={'flex'} bgcolor={'whitesmoke'} alignItems={'center'} >
          {receiverData && 
        <Avatar sx={{ marginLeft:'1rem'}} src={receiverData ? receiverData?.profileImage : receiverData?.username}/>
          }
        <h4 style={{ margin: 0, padding:receiverData?.username && 15.8, backgroundColor: "whitesmoke" }}>
          {receiverData ? receiverData.username : ''}{" "}
        </h4>
        </Box>

        <Divider />
        <div style={messagesDiv}  ref={messagesContainerRef} className="messgageBox">
          {/* messages area */}

          {allMessages?.length ?
            allMessages.map(({ id, messages }) => {
              return (
                <div
                  key={id}
                  style={{
                    margin: 2,
                    display: "flex",
                    flexDirection:
                      user?.uid == messages.messageUserId
                        ? "row-reverse"
                        : "row",
                  }}
                >
                  <span
                    style={{
                      backgroundColor:user?.uid == messages.messageUserId ? "#BB8FCE" : "#40de43",
                      padding: 10,
                      color:'white',
                      borderTopLeftRadius:
                        user?.uid == messages.messageUserId ? 10 : 0,
                      borderTopRightRadius:
                        user?.uid == messages.messageUserId ? 0 : 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      maxWidth: 400,
                      fontSize: 15,
                      textAlign:
                        user?.uid == messages.messageUserId ? "right" : "left",
                    }}
                  >
                    {messages.message}
                  </span>
                </div>
              );
            })
           :
            receiverData?.username && 
           <Box mt={2}>
             <Typography sx={{padding:'.2rem 5rem', borderRadius:'10px',textAlign:'center', margin:'auto' , background:'#e1dcdc' , width:'fit-content'}}> No messages</Typography>
           </Box> 
          }
        </div>
        {receiverData?.username && (
          <div style={{ width: "100%", display: "flex", flex: 0.08 , margin:'.5rem 0rem'}}>
            <input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              style={input}
              type="text"
              placeholder="Type message..."
            />
            <Button
              onClick={sendMessage}
              sx={{ mr: 1, background: "skyblue", color: "white", ":hover":{background : "skyblue"} }}
            >
              {/* <Typography></Typography> */}
              <SendIcon style={{ margin: 1 }} />
            </Button>
          </div>
        )}
      </Box>
    </div>
  );
}

const root = {
  display: "flex",
  flexDirection: "row",
  flex: 1,
  background: "",
  width: "100%",
};

const left = {
  display: "flex",
  flex: 0.2,
  height: "100vh",
  background: "",
  // margin: 10,
  flexDirection: "column",
};

const right = {
  display: "flex",
  background: "#FBEEE6",
  flex: 0.8,
  height: "100vh",
  // margin: 10,
  flexDirection: "column",
};

const input = {
  flex: 1,
  outline: "none",
  marginLeft: ".5rem",
  marginRight: "1rem",
  backgroundColor: "#e7e7e7",
  borderRadius: 5,
  paddingLeft: ".5rem",
  border: "none",
};

const messagesDiv = {
  backgroundColor: "#FBEEE6",
  padding: 5,
  marginRight: ".2rem",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  maxHeight: 470,
  overflowY: "auto",
};
