import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "../../schemas/auth.schema";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaSpinner, FaSignInAlt } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";

export default function Login() {
  const {userLogin, setuserLogin } = useContext(AuthContext)
  const navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },

    resolver: zodResolver(LoginSchema),

    mode: "onChange",
  });

  let { register, handleSubmit, formState } = form;

  function handleLogin(values: LoginSchemaType) {
  console.log(values);

  setisLoading(true);

  axios
    .post("https://route-posts.routemisr.com/users/signin", values)
    .then((res) => {
      console.log(res.data.success);

      if (res.data.success) {
        localStorage.setItem("userToken", res.data.data.token );
        setuserLogin(res.data.data.token );

        navigate("/");
      }
    })
    .catch((err) => {
      console.log(err.response.data.message);
      setapiError(err.response.data.message);
    })
    .finally(() => {
      setisLoading(false);
    });
}

  return (
    <>
      <h1 className="text-center text-5xl font-bold">Login Now</h1>

      {apiError && (
        <p className="bg-red-50 border border-red-200 text-red-600 text-sm text-center p-3 my-5 mx-auto rounded-xl w-[300px]">
          {apiError}
        </p>
      )}

      <div className="max-w-xl mx-auto my-10 border border-blue-200 rounded-2xl shadow-sm p-8 bg-white">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isLoading ? "Logging in..." : "Welcome back"}
        </h1>

        <p className="text-gray-700 mb-8">
          Login to continue to your account.
        </p>

        <form onSubmit={handleSubmit(handleLogin)}>
          
          <div className="mb-4">
            <label htmlFor="email">Email address</label>

            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Email address"
              className="bg-gray-50 border border-blue-200 text-gray-900 text-sm rounded-2xl block w-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {formState.errors.email?.message &&
              formState.touchedFields.email && (
                <p className="text-red-500">
                  {formState.errors.email.message}
                </p>
              )}
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password</label>

            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Password"
              className="bg-gray-50 border border-blue-200 text-gray-900 text-sm rounded-2xl block w-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {formState.errors.password?.message &&
              formState.touchedFields.password && (
                <p className="text-red-500">
                  {formState.errors.password.message}
                </p>
              )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full transition-all text-white bg-blue-700 cursor-pointer hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium rounded-2xl text-base px-5 py-4 mt-3 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <FaSignInAlt />
                Login
              </>
            )}
          </button>

          <div className="text-center mt-5 text-sm text-gray-500">
            <span>Don't have an account? </span>

            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}