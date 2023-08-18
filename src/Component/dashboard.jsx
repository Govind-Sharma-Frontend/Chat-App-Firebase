import {
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  Fade,
  Grid,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  query,
  orderBy,
  onSnapshot,
  limit,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { Form, Formik } from "formik";
import CustomTextField from "./CustomComponents/CustomTextField";
import { useAuthState } from "react-firebase-hooks/auth";

// import styled from "@emotion/styled";

// const ChatBoxWaraper = styled("div")`

// .chatBox::-webkit-scrollbar{
//   display: none !important;
// }

//   `;

function ScrollTop(props) {
  console.log("props", props);
  const { children } = props;
  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <Fade in={props?.scroll}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 60, right: 25 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  scroll: PropTypes.any,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const Dashboard = () => {
  const history = useNavigate();
  const [user] = useAuthState(auth);
  const [scroll, setScroll] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const signOut = () => {
    auth.signOut();
  };

console.log('messages',messages);

  const sendMessage = async (event) => {
    console.log('event',event);
    // event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(db, "messages"), {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    });
    setMessage("");
  };

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    console.log('q',q);
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe;
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{ paddingRight: { sm: "0px" }, height: "100vh", overflow: "hidden" }}
    >
      <Grid container>
        <Grid item xs={3}>
          aaasdasd
        </Grid>
        <Grid
          item
          xs={9}
          height={"100vh"}
          position={"relative"}
          bgcolor={"#d1d1d1"}
        >
          <AppBar position="fixed" sx={{ right: "auto" }}>
            <Toolbar>
              <Button
                sx={{ background: "red", color: "white", fontWeight: 700 }}
                onClick={()=> {signOut(); history('/')}}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <Toolbar id="back-to-top-anchor" />
          <Box
            pb="3rem"
            className="chatBox"
            height={"81vh"}
            overflow={"scroll"}
            onScroll={(e) => {
              if (e.currentTarget.scrollTop > 0) {
                setScroll(true);
              } else {
                setScroll(false);
              }
            }}
          >
            {/* <ChatBoxWaraper> */}

            <Box px={2} display={"flex"} flexDirection={"column"}>
              {messages?.map((item) => (
                <Box
                  key={item?.id}
                  width={"fit-content"}
                  maxWidth={"500px"}
                  ml={item.uid === user.uid ? "auto" : ""}
                  bgcolor={"white"}
                  padding={"10px"}
                  my={1}
                  borderRadius={"10px"}
                >
                  {" "}
                  {item?.text}{" "}
                </Box>
              ))}
            </Box>
            {/* </ChatBoxWaraper>  */}
          </Box>
          <Formik 
            initialValues={{message : message}}
            onSubmit={(values)=>{ 
              setMessage(values?.message)
              if(message !== ''){
                sendMessage(values?.message)
              }
            }}
          >
            {()=>{
              return (<Form>
          <Box
            py={1}
            display={"flex"}
            gap={2}
            bgcolor={"gray"}
            position={"absolute"}
            bottom={0}
            right={0}
            width={"100%"}
          >
            <CustomTextField   name="message" label="" placeholder={'enter here'} />
            {/* <TextField sx={{margin:'10px' ,borderRadius:'40px', background:'white',":first-child":{borderRadius:'40px'}}}  fullWidth  id="fullWidth" variant="filled" />  */}
            {/* <input
              value={message}
              name="message"
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              style={{
                padding: ".5rem 1rem",
                marginLeft: "1rem",
                borderRadius: "40px",
                border: "none",
                outline: "none",
                width: "100%",
              }}
              placeholder="Enter here"
            /> */}
            <Button type="submit" sx={{ mr: "1rem", background: "green", color: "white" }}>
              Send
            </Button>
          </Box>
              </Form>)
            }}

          </Formik>
          {/* <Box sx={{ my: 2 }}>
            {[...new Array(12)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
                        Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                        Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")}
          </Box> */}
          <ScrollTop scroll={scroll}>
            <Fab size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
