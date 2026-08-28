import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../Api/requests";
import { Mail, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const res = await api.sendRecoveryMail({ email });
    if (res.status === 200) setSuccessMsg(res.data.message);
    else setErrorMsg(res.data.error);
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
              Account Recovery
            </p>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Reset your access.
              <br />
              <span className="text-neutral-400">Get back to work.</span>
            </h1>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Enter the email linked to your account and we&apos;ll send you a
              secure link to choose a new password.
            </p>
          </div>

          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} Eugenics. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form */}
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
              Forgot password?
            </h2>
            <p className="text-neutral-500 mt-2 text-sm sm:text-base">
              We&apos;ll email you a link to reset your password
            </p>
          </div>

          <form
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-neutral-100 p-6 sm:p-8"
            onSubmit={handleClick}
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-neutral-700"
              >
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-xl px-4 h-12 border border-neutral-200 bg-neutral-50/80 focus-within:border-brand-red focus-within:ring-2 focus-within:ring-brand-red/10 transition-all">
                <Mail size={18} className="text-neutral-400 shrink-0" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="bg-transparent flex-1 outline-none text-sm placeholder:text-neutral-400 text-neutral-900"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg("");
                    if (successMsg) setSuccessMsg("");
                  }}
                  value={email}
                />
              </div>
            </div>

            {successMsg && (
              <div
                role="status"
                className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 text-center"
              >
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center"
              >
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 mt-6 text-base font-semibold bg-brand-red hover:bg-brand-red-dark shadow-md shadow-brand-red/20 gap-2"
              disabled={!email || isLoading}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Send reset link
                  <ArrowRight size={18} />
                </>
              )}
            </Button>

            <div className="mt-5 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand-red font-medium transition-colors"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </Link>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-400 lg:hidden">
            &copy; {new Date().getFullYear()} Eugenics
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
