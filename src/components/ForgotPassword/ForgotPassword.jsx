import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../Api/requests";
import { Lock, Mail, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await api.sendRecoveryMail({ email });
    if (res.status === 200) setSuccessMsg(res.data.message);
    else setErrorMsg(res.data.error);
    setIsLoading(false);
  };

  return (
    <div className="bg-black min-h-dvh flex items-center justify-center px-4">
      <form className="w-full max-w-sm animate-fade-in" onSubmit={handleClick}>
        <div className="bg-stone-900/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-white border border-stone-700/50">
          <div className="flex flex-col items-center mb-6">
            <Lock size={40} className="text-brand-blue mb-3" />
            <h1 className="text-xl font-semibold tracking-widest uppercase">Forgot Password?</h1>
            <p className="text-stone-400 text-sm mt-1">We'll send a reset link to your email.</p>
          </div>

          <div className="flex items-center gap-3 bg-stone-800/60 rounded-lg px-4 h-12 border border-stone-700 focus-within:border-brand-blue transition-colors">
            <Mail size={18} className="text-stone-400 shrink-0" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-stone-500 text-white"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {(successMsg || errorMsg) && (
            <p className={`text-sm text-center mt-3 ${successMsg ? "text-green-400" : "text-red-400"}`}>
              {successMsg || errorMsg}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-12 mt-5 text-base font-semibold"
            disabled={!email || isLoading}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Send Reset Link"}
          </Button>

          <div className="mt-4 text-center">
            <Link to="/" className="text-stone-400 hover:text-brand-blue text-sm transition-colors">
              ← Back to Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
