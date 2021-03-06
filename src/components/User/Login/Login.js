import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Header from "../../Header/Header";
import rootAPI from "../../../configurables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

export default function Login() {
  const [userLoginEmail, setUserLoginEmail] = useState("");
  const [loginAttempt, setLoginAttempt] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [startTimeout, setStartTimeout] = useState(false);
  const [countDown, setCountDown] = useState(null);
  const [userLoginPassword, setUserLoginPassword] = useState("");
  const [forgetEmail, setForgetEmail] = useState("");
  const [isForgetPass, setIsForgetPass] = useState(false);
  const [otpField, setOtpField] = useState("");
  const [isOtpSended, setIsOtpSended] = useState(false);
  const [isOtpCorrect, setIsOtpCorrect] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const history = useHistory();
  const { setUser } = useAuth();
  const getTimeout = localStorage.getItem('timeout');

  React.useEffect(() => {
    if (getTimeout) {
      setTotalTime(getTimeout)
      setStartTimeout(true);
    }
  }, [getTimeout]);

  const handleLogin = (e) => {
    e.preventDefault();
    userLogin(userLoginEmail, userLoginPassword, history);
    e.target.reset();
  };
  const userLogin = (userLoginEmail, userLoginPassword, history) => {
    toast.info("Please wait for Login!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    const loginDetails = {
      email: userLoginEmail,
      password: userLoginPassword,
    };

    axios
      .post(`${rootAPI}/login`, loginDetails)
      .then((res) => {
        if (res.data.isSuccess) {
          toast.success("Welcome to your OrganicFarming !", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setUser(res.data.user_info);
          localStorage.setItem(
            "organicFarm-user",
            JSON.stringify(res.data.user_info)
          );
          setLoginAttempt([]);
          history.replace("/myAccount");
        } else {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoginAttempt((prev) => [...prev, 'failed']);
        }
        console.log(res);
      })
      .catch((error) => console.log(error));
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${rootAPI}/forget_password`, {
        email: forgetEmail,
      })
      .then((res) => {
        console.log(res);
        if (res.data.isSuccess) {
          toast.success(res.data.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsOtpSended(true);
        } else {
          toast.error(res.data.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setOtpField("");
          setIsOtpSended(false);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setUserLoginEmail("");
        setUserLoginPassword("");
      });
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${rootAPI}/validate_OTP`, {
        email: forgetEmail,
        OTP: Number(otpField),
      })
      .then((res) => {
        console.log(res);
        setIsOtpCorrect(true);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setOtpField("");
      });
  };

  const handleNewPassowrdSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${rootAPI}/set_new_password`, {
        email: forgetEmail,
        newPassword: newPassword,
      })
      .then((res) => {
        console.log(res);
        setIsOtpCorrect(false);
        setIsOtpSended(false);
        setIsForgetPass(false);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setNewPassword("");
        setForgetEmail("");
      });
  };

  React.useEffect(() => {
    if (loginAttempt.length > 2) {
      const timeout = new Date((new Date()).getTime() + 30 * 60000);
      localStorage.setItem('timeout', timeout);
      window.location.reload();
    }
  }, [loginAttempt]);

  if (startTimeout) {
    setInterval(function(){
      if (localStorage.getItem('timeout')) {
        if (((new Date()).getTime() - new Date(totalTime).getTime()) > 0) {
          localStorage.removeItem('timeout');
          setTotalTime(0);
        }
        setCountDown(dayjs((new Date(totalTime || 0)).getTime() - (new Date()).getTime()).format('mm:ss'))
      }
    }, 1000);
  }

  if (countDown?.second < 0) {
    setCountDown(null);
  }

  return (
    <div>
      <Header />
      <ToastContainer />
      <div className="container my-4">
        <div className="row justify-content-center align-items-center">
          <div className="col-sm-9 col-lg-6 col-xs-12">
            {!isForgetPass ? (
              <div>
                <form onSubmit={handleLogin}>
                  <h3>Login</h3>
                  <div className="form-group">
                    <label
                      className="my-3 h5 text-secondary"
                      htmlFor="loginEmail"
                    >
                      Email address
                    </label>
                    <input
                      id="loginEmail"
                      required
                      type="email"
                      className="form-control"
                      aria-describedby="emailHelp"
                      placeholder="Enter email"
                      value={userLoginEmail}
                      onChange={(e) => setUserLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      className="my-3 h5 text-secondary"
                      htmlFor="loginPassward"
                    >
                      Password
                    </label>
                    <input
                      id="loginPassward"
                      required
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={userLoginPassword}
                      onChange={(e) => setUserLoginPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-4 d-block border-0 forget-pass"
                    onClick={() => setIsForgetPass(true)}
                  >
                    Forget Password?
                  </button>
                  {
                    !getTimeout && (
                      <button type="submit" className="myBtn my-4 py-2 px-4 h5">
                        Login
                      </button>
                    )
                  }
                  {/* countDown */}
                  {
                    getTimeout && countDown ? (
                      <div className="alert alert-danger" role="alert">
                        Due to entering wrong password many time, you're blocked! You'll be unblock in {countDown?.split(':')[0]} minutes and {countDown?.split(':')[1]} seconds!
                      </div>
                    ) : ''
                  }
                </form>
              </div>
            ) : (
              <div>
                <h3>Forget Password!</h3>
                {!isOtpSended ? (
                  <form onSubmit={handleEmailSubmit}>
                    <div className="form-group">
                      <label
                        className="my-3 h5 text-secondary"
                        htmlFor="forgetEmail"
                      >
                        Email address
                      </label>
                      <input
                        required
                        id="forgetEmail"
                        type="email"
                        value={forgetEmail}
                        className="form-control"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        onChange={(e) => setForgetEmail(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="myBtn my-4 py-2 px-4 h5">
                      Submit Email
                    </button>
                  </form>
                ) : !isOtpCorrect ? (
                  <form onSubmit={handleOTPSubmit}>
                    <div className="form-group">
                      <label className="my-3 h5 text-secondary" htmlFor="otp">
                        OTP
                      </label>
                      <input
                        required
                        id="otp"
                        type="text"
                        value={otpField}
                        className="form-control"
                        aria-describedby="emailHelp"
                        placeholder="Enter OTP..."
                        onChange={(e) => setOtpField(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="myBtn my-4 py-2 px-4 h5">
                      Submit OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleNewPassowrdSubmit}>
                    <div className="form-group">
                      <label
                        className="my-3 h5 text-secondary"
                        htmlFor="newPassowrd"
                      >
                        New Password
                      </label>
                      <input
                        required
                        id="newPassowrd"
                        type="password"
                        value={newPassword}
                        className="form-control"
                        aria-describedby="emailHelp"
                        placeholder="Enter New Password..."
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="myBtn my-4 py-2 px-4 h5">
                      Set Password
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  className="mt-4 d-block border-0 forget-pass"
                  onClick={() => setIsForgetPass(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>{" "}
                  Go Back
                </button>
              </div>
            )}

            <h6 className="mt-4 text-secondary text-center">
              Do not have an accout?
              <Link className="myLink" to="/registration">
                Registration
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}
