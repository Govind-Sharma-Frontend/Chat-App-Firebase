import { Box, Button, Container, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import CustomTextField from "./CustomComponents/CustomTextField";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import { auth, db } from "../firebase";

import { A11y, EffectCards, Navigation } from "swiper/modules";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import 'swiper/css/navigation';
import "swiper/css/effect-cards";
// import { useAuthState } from "react-firebase-hooks/auth";
import {
  // GoogleAuthProvider,
  // signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import background from '../assets/loginBackground.jpg';
const LoginPage = () => {
  const history = useNavigate();
  // const [user] = useAuthState(auth);
  // const [sigin, setSigin] = useState(0);
  // console.log('sigin',sigin);
  // console.log("login user", user);
  // const googleSignIn = () => {
  //   const provider = new GoogleAuthProvider();
  //   signInWithRedirect(auth, provider);
  // };
  // const signOut = () => {
  //   auth.signOut();
  // }; 
  const swiper = useSwiper();
  
  return (
    <Container
      maxWidth="xl"
      sx={{
        overflow: "hidden",
        background:`url(${background})`,
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover',
        // filter: 'blur(8px)',      
        height: "100vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box width={450} height={400} >

      <Swiper
        // install Swiper modules
        modules={[EffectCards,Navigation,A11y]}
        spaceBetween={50}
        loop={true}
        effect="cards"
        //   navigation
        //   pagination={{ clickable: true }}
        //   scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        <SwiperSlide>
          <Box
            bgcolor={"whitesmoke"}
            padding={2}
            borderRadius={5}
            width={400}
            height={400}
            textAlign={"center"}
          >
            <Typography fontSize={30} fontWeight={700}>
              Login
            </Typography>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={async (values) => {
                signInWithEmailAndPassword(auth, values.email, values.password)
                  .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("user", user);
                    history(`/dashboard`);
                  })
                  .catch((error) => {
                    alert(error.message);
                  });
              }}
            >
              {() => (
                <Form>
                  <Box width={300} mx={5} my={5}>
                    <CustomTextField name="email" label="Email" />
                  </Box>
                  <Box width={300} mx={5}>
                    <CustomTextField name="password" label="Password" />
                  </Box>
                  {/* {user ? (
                  <Box>
                    <Typography onClick={signOut} variant="button">
                      Sing out
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography onClick={googleSignIn} variant="button">
                      Sing In with google
                    </Typography>
                  </Box>
                )} */}
                  <Box my={3}  onClick={()=> swiper.slideNext()}>
                    <Typography>
                      Do not have account ?{" "}
                      <span
                        style={{ color: "blue", textDecoration: "underline" }}
                      >
                        sign up
                      </span>{" "}
                    </Typography>
                  </Box>
                  <Button type="submit" color="primary">
                    Log In
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box
            padding={2}
            bgcolor={'white'}
            className={'chatBox'}
            borderRadius={5}
            width={400}
            height={400}
            overflow={'scroll'}
            textAlign={"center"}
          >
            <Typography fontSize={30} fontWeight={700}>
              Register
            </Typography>

            <Formik
              initialValues={{
                username: "",
                email: "",
                mobileNumber: "",
                password: "",
                confirmPassword: "",
              }}
              onSubmit={async (values) => {
                // values.preventDefault();
                try {
                  const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                  );

                  console.log("userCredential", userCredential);

                  const user = userCredential.user;

                  await updateProfile(user, {
                    displayName: values.username,
                  });

                  await setDoc(doc(db, "users", user.uid), {
                    username: values?.username,
                    email: values?.email,
                    userId: user?.uid,
                    timestamp: new Date(),
                  });
                  console.log("User registered:", user);
                } catch (error) {
                  console.error("Error creating user:", error.message);
                }
              }}
            >
              {() => (
                <Form>
                  <Box width={300} mx={5} my={5}>
                    <CustomTextField
                      type="text"
                      name="username"
                      label={"User name "}
                    />
                  </Box>
                  <Box width={300} mx={5} my={5}>
                    <CustomTextField
                      type="email"
                      name="email"
                      label={"Email"}
                    />
                  </Box>
                  <Box width={300} mx={5} my={5}>
                    <CustomTextField
                      type="number"
                      name="mobileNumber"
                      label={"Mobile Number"}
                    />
                  </Box>
                  <Box width={300} mx={5} my={5}>
                    <CustomTextField name="password" label={"Password"} />
                  </Box>
                  <Box width={300} mx={5}>
                    <CustomTextField
                      name="confirmPassword"
                      label={"Confirm Password"}
                    />
                  </Box>

                  <Button type="submit" color="primary" sx={{ mt: "2rem" }}>
                    Register
                  </Button>
                  <Box onClick={(e)=> swiper.slideNext(e.target) }>
                    <Typography>Sign in</Typography>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>{" "}
        </SwiperSlide>
        l
      </Swiper>
      </Box>
    </Container>
  );
};

export default LoginPage;
