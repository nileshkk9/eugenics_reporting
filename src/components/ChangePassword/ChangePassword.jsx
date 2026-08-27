import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../Api/requests";
import { LockOpen, Lock, User, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const ChangePassword = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rePassword: "",
    token: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  const validateForm = () =>
    form.password.length > 5 &&
    form.rePassword.length > 5 &&
    form.password === form.rePassword;

  useEffect(() => {
    setForm((prev) => ({ ...prev, token: params.token, email: params.email }));
  }, [params.email, params.token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const validator = () => {
    const { password: pass, rePassword: repass } = form;
    if (pass.length <= 5 && pass.length >= 3) return "Password too short!";
    if (pass.length > 5 && repass.length > 5 && pass !== repass)
      return "Passwords do not match!";
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await api.verifyPasswordResetToken({
      password: form.password,
      token: form.token,
      email: form.email,
    });
    if (res.status === 200) setSuccessMsg(res.data.message);
    else setErrorMsg(res.data.error);
    setIsLoading(false);
    setTimeout(() => navigate("/"), 3000);
  };

  return (
    <div className="bg-black min-h-dvh flex items-center justify-center px-4">
      <form className="w-full max-w-sm animate-fade-in" onSubmit={handleClick}>
        <div className="bg-stone-900/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-white border border-stone-700/50">
          <div className="flex flex-col items-center mb-6">
            <LockOpen size={40} className="text-brand-blue mb-3" />
            <h1 className="text-xl font-semibold tracking-widest uppercase">Reset Password</h1>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-stone-800/60 rounded-lg px-4 h-12 border border-stone-700 opacity-60">
              <User size={18} className="text-stone-400 shrink-0" />
              <input
                type="text"
                disabled
                value={form.email}
                className="bg-transparent flex-1 outline-none text-sm text-stone-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-stone-800/60 rounded-lg px-4 h-12 border border-stone-700 focus-within:border-brand-blue transition-colors">
              <Lock size={18} className="text-stone-400 shrink-0" />
              <input
                id="password"
                type="password"
                placeholder="New password"
                className="bg-transparent flex-1 outline-none text-sm placeholder:text-stone-500 text-white"
                onChange={handleChange}
                value={form.password}
              />
            </div>

            <div className="flex items-center gap-3 bg-stone-800/60 rounded-lg px-4 h-12 border border-stone-700 focus-within:border-brand-blue transition-colors">
              <Lock size={18} className="text-stone-400 shrink-0" />
              <input
                id="rePassword"
                type="password"
                placeholder="Confirm password"
                className="bg-transparent flex-1 outline-none text-sm placeholder:text-stone-500 text-white"
                onChange={handleChange}
                value={form.rePassword}
              />
            </div>
          </div>

          {validator() && (
            <p className="text-amber-400 text-sm text-center mt-2">{validator()}</p>
          )}
          {(successMsg || errorMsg) && (
            <p className={`text-sm text-center mt-2 ${successMsg ? "text-green-400" : "text-red-400"}`}>
              {successMsg || errorMsg}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-12 mt-5 text-base font-semibold"
            disabled={!validateForm() || isLoading}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
