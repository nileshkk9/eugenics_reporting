import { api } from "../../Api/requests";
import { Link, useNavigate } from "react-router-dom";
import auth from "../auth";
import { useEffect, useState } from "react";
import { LOCAL_AUTH_KEY } from "../../utils/constants";
import { User, Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const Login = () => {
  const [inputField, setInputField] = useState({ username: "", password: "" });
  const [errMsg, setErrMsg] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(LOCAL_AUTH_KEY)) {
      const authToken = JSON.parse(localStorage.getItem(LOCAL_AUTH_KEY));
      async function verifyUser() {
        const res = await api.getUser();
        if (res.status === 200) setToken(authToken);
        else navigate("/");
      }
      verifyUser();
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      auth.login(() => {
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(token));
        navigate("/main/upload");
      });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputField({ ...inputField, [id]: value });
    if (errMsg) setErrMsg("");
  };

  const validateForm = () =>
    inputField.username.length > 4 && inputField.password.length > 4;

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await api.loginUser(inputField);
    if (res.status === 200) setToken(res.data.token);
    else setErrMsg(res.data.error);
    setIsLoading(false);
  };

  return (
    <div className="min-h-dvh flex bg-neutral-50">
      {/* Brand panel — desktop */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden bg-neutral-950 text-white">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #c41230 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3498db 0%, transparent 45%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="inline-flex rounded-md bg-white px-2 py-1 shadow-sm w-fit">
            <img
              src="/logo.jpg"
              alt="Eugenics"
              className="w-20 xl:w-24 h-auto object-contain"
            />
          </div>

          <div className="space-y-4 max-w-md">
            <p className="text-brand-red text-sm font-semibold tracking-widest uppercase">
              Field Reporting
            </p>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Capture insights.
              <br />
              <span className="text-neutral-400">Drive results.</span>
            </h1>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Sign in to upload field reports, track regional data, and stay
              connected with your team.
            </p>
          </div>

          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} Eugenics. All rights reserved.
          </p>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px] animate-fade-in">
          <div className="lg:hidden flex justify-center mb-8">
            <img
              src="/logo.jpg"
              alt="Eugenics"
              className="w-16 sm:w-20 h-auto object-contain"
            />
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base">
              Enter your credentials to access the portal
            </p>
          </div>

          <form
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-100 p-6 sm:p-8"
            onSubmit={handleClick}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-neutral-700"
                >
                  Username
                </label>
                <div className="flex items-center gap-3 rounded-xl px-4 h-12 border border-neutral-200 bg-neutral-50/80 focus-within:border-brand-red focus-within:ring-2 focus-within:ring-brand-red/10 transition-all">
                  <User size={18} className="text-neutral-400 shrink-0" />
                  <input
                    id="username"
                    type="text"
                    placeholder="your.username"
                    autoComplete="username"
                    className="bg-transparent flex-1 outline-none text-sm placeholder:text-neutral-400 text-neutral-900"
                    onChange={handleChange}
                    value={inputField.username}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-neutral-700"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-brand-red hover:text-brand-red-dark font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="flex items-center gap-3 rounded-xl px-4 h-12 border border-neutral-200 bg-neutral-50/80 focus-within:border-brand-red focus-within:ring-2 focus-within:ring-brand-red/10 transition-all">
                  <Lock size={18} className="text-neutral-400 shrink-0" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="bg-transparent flex-1 outline-none text-sm placeholder:text-neutral-400 text-neutral-900"
                    onChange={handleChange}
                    value={inputField.password}
                  />
                </div>
              </div>
            </div>

            {errMsg && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center"
              >
                {errMsg}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 mt-6 text-base font-semibold bg-brand-red hover:bg-brand-red-dark shadow-md shadow-brand-red/20 gap-2"
              disabled={!validateForm() || isLoading}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-400 lg:hidden">
            &copy; {new Date().getFullYear()} Eugenics
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
