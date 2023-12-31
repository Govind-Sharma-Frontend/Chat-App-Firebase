import { Box, Button, Container, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import CustomTextField from "./CustomComponents/CustomTextField";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import { auth, db, storage } from "../firebase";

import { A11y, EffectCards, Navigation } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
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
import background from "../assets/loginBackground5.jpg";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { Flip, toast } from "react-toastify";
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

  // image upload
  const [file, setFile] = useState("");
  console.log('file',file);
  const [imageUrl, setImageUrl] = useState("");
  const [percent, setPercent] = useState("");
  function handleChange(event) {
    console.log('event',event);
    setFile(event.target.files[0]);
  }
  const handleUpload = () => {
    if (!file) {
      toast.error("Please upload an image first!",{  transition: Flip , toastId:'upload'});
    }

    const storageRef = ref(storage, `/files/${file.name}`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageUrl(url)
        });
      }
    );
  };

  // const registrationSchema = 

  return (
    <Container
      maxWidth="xl"
      sx={{
        overflow: "hidden",
        background: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition:'center',
        // filter: 'blur(8px)',
        height: "100vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box width={450} height={400}>
        <Swiper
          // install Swiper modules
          modules={[EffectCards, Navigation, A11y]}
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
                  signInWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                  )
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
                      <CustomTextField required name="email" label="Email" />
                    </Box>
                    <Box width={300} mx={5}>
                      <CustomTextField required type="password" name="password" label="Password" />
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
                    <Button type="submit" sx={{":hover":{background:'#BB8FCE'},  background:'#BB8FCE', mt: 10, width:'50%', color:'white' }}>
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
              bgcolor={"white"}
              className={"chatBox"}
              borderRadius={5}
              width={400}
              height={400}
              overflow={"scroll"}
              textAlign={"center"}
            >
              <Typography fontSize={30} fontWeight={700}>
                Register
              </Typography>

              <Formik
              // validationSchema={registrationSchema}
                initialValues={{
                  username: "",
                  email: "",
                  mobileNumber: "",
                  password: "",
                  confirmPassword: "",
                }}
                onSubmit={async (values ,{resetForm}) => {
                  // values.preventDefault();
                  try {
                    const userCredential = await createUserWithEmailAndPassword(
                      auth,
                      values.email,
                      values.password
                    );

                    const user = userCredential.user;
                    if (user) {
                        resetForm();
                        toast.success('Registered Successfully', {transition: Flip , toastId:'register'})                      
                    }
                    await updateProfile(user, {
                      displayName: values.username,
                    });

                    await setDoc(doc(db, "users", user.uid), {
                      username: values?.username,
                      email: values?.email,
                      userId: user?.uid,
                      profileImage:imageUrl,
                      timestamp: new Date(),
                    });
                  } catch (error) {
                    toast.error(error.message, {transition: Flip , toastId:'register'});
                  }
                }}
              >
                {() => (
                  <Form>
                    <Box width={300} mx={5} my={5}>
                      <CustomTextField
                        type="text"
                        required
                        name="username"
                        onInput={(e) =>
                          (e.target.value = e.target.value.slice(0, 30))
                        }
                        label={"User name "}
                      />
                    </Box>
                    <Box width={300} mx={5} my={5}>
                      <CustomTextField
                        type="email"
                        name="email"
                        required
                        label={"Email"}
                      />
                    </Box>
                    <Box width={300} mx={5} my={5}>
                      <CustomTextField
                        type="number"
                        required
                        onInput={(e) =>
                          (e.target.value = e.target.value.slice(0, 10))
                        }
                        name="mobileNumber"
                        label={"Mobile Number"}
                      />
                    </Box>
                    <Box width={300} mx={5} my={5}>
                      <CustomTextField
                        name="password"
                        type="password"
                        required
                        onInput={(e) =>
                          (e.target.value = e.target.value.slice(0, 30))
                        }
                        label={"Password"}
                      />
                    </Box>
                    <Box width={300} mx={5} my={5}>
                      <CustomTextField
                        name="confirmPassword"
                        type="password"
                        onInput={(e) =>
                          (e.target.value = e.target.value.slice(0, 30))
                        }
                        label={"Confirm Password"}
                      />
                    </Box>
                    <Box width={300} mx={5}>
                      <CustomTextField
                        name="file"
                        type="file"
                        id='file-input'
                        onChange={handleChange}
                        // label={"Upload Image"}
                      />
                      <Button sx={{background:'#FBEEE6' , my:2 , px:3, color:'gray'}} onClick={handleUpload}>Upload</Button>
                       {percent > 1 && 
                       <p>{percent} % done</p>
                       }
                    </Box>

                    <Button type="submit" sx={{":hover":{background:'#BB8FCE'},  background:'#BB8FCE', mt: "2rem", width:'50%', color:'white' }}>
                      Register
                    </Button>
                    {/* <Box onClick={(e) => swiper.slideNext(e.target)}>
                      <Typography>Sign in</Typography>
                    </Box> */}
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
