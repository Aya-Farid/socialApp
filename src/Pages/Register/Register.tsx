
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema , type RegisterSchemaType } from '../../schemas/auth.schema';
import axios from 'axios';
import { useNavigate , Link} from 'react-router-dom';
import { FaSpinner, FaUserPlus } from "react-icons/fa";



// interface userData { "name": string,
//           "email": string,
//           "dateOfBirth": string,
//           "gender": "male" | "female",
//           "password": string,
//           "rePassword": string,
//         }





export default function Register() {

  const navigate = useNavigate();
  //handle error catch
  const [apiError, setapiError] = useState(null)
  const [isLoading, setisLoading] = useState(false)

  const form = useForm<RegisterSchemaType>({
    defaultValues : {
          "name": "",
          "email": "",
          "dateOfBirth": "",
          "gender": "female",
          "password": "",
          "rePassword": ""
        },
        resolver : zodResolver(RegisterSchema),


        mode :"onChange"
  })

  let { register , handleSubmit, formState, getValues, watch, setError} = form; //register new field!

  
//   const [name, setname] = useState("");

//   function hadleRegister(e) {
//     e.preventDefault();
//     //step 1 get Inputs
    


//     /*
//     //Uncontrolled

//     let nameInput = document.querySelector("#name")! as HTMLInputElement;
//     let emailInput = document.querySelector("#email")! as HTMLInputElement;
//     let dateOfBirthInput = document.querySelector("#dateOfBirth")!  as HTMLInputElement;
//     let passwordInput = document.querySelector("#password")!  as HTMLInputElement;
//     let rePasswordInput = document.querySelector("#rePassword")!  as HTMLInputElement;
//     let genderInput = document.querySelector("#gender")!  as HTMLInputElement;
//   */
//     //step 2 create Object 

//     const data = {
//         "name": nameInput.value,
//         "email": emailInput.value,
//         "dateOfBirth": dateOfBirthInput.value,
//         "gender": genderInput.value,
//         "password": passwordInput.value,
//         "rePassword": rePasswordInput.value,
// };
    


// console.log(data)

//   }

//   function handleNameInput(e){
//     setname(e.target.value);

//   }
function handleRegister(values :RegisterSchemaType){
  //then validation & call api
  console.log(values);

  setisLoading(true)

  axios.post("https://route-posts.routemisr.com/users/signup", values)
  .then( (res) => {
    // console.log(res.data.success);
      if (res.data.success){

        // alert(res.data.message);
        //login page (Routing //UseNavigate import)
        //login page
        navigate("/login")
      }
    

  } )
  .catch( (err) => {console.log(err.response.data.message);
    setapiError(err.response.data.message)
  } )
  .finally( () => {
    setisLoading(false)
  })


  /*
   //======> setError for confirm password (show when submit not real time)
  
    if (values.rePassword===values.password){
    //call api
  } else{
    setError("rePassword", {message:"not matched"})
  }


  */





}



  return (
    <>
      <h1 className="text-center text-5xl font-bold">Register Now</h1>

      {apiError && (
        <p className="bg-red-50 border border-red-200 text-red-600 text-sm text-center p-3 my-5 mx-auto rounded-xl w-[300px]">
          {apiError}
        </p>
      )}

      <div className="max-w-xl mx-auto my-10 border border-blue-200 rounded-2xl shadow-sm p-8 bg-white">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create a new account
        </h1>

        <p className="text-gray-700 mb-8">It is quick and easy.</p>

        <form onSubmit={handleSubmit(  handleRegister )}>
          <div className="mb-4">
            <label htmlFor="name">Full name</label>
            <input {...register("name",
            // {
            //         required:{value:true , message: "name is required"},
            //         minLength : {value:3, message:"name should be 3 letters or more..."},
            //         maxLength : {value:20, message:"name should be less than 20 letters.."}

            // }
          )}
              type="text"
              id="name"
              placeholder="Full name"
              className="bg-gray-50 border border-blue-200 text-gray-900 text-sm rounded-2xl block w-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formState.errors.name?.message && formState.touchedFields.name &&(
              <p className='text-red-500'>{formState.errors.name?.message }</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email">Email address</label>
            <input
            {...register("email",
            //   {
            //         required:{value:true , message: "email is required"},
            //         pattern: {
            //           value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            //           message: "Hmm... that doesn't look like a valid email."
            //         }
            // }
          )}
              type="email"
              id="email"
              placeholder="Email address"
              className="bg-gray-50 border border-blue-200 text-gray-900 text-sm rounded-2xl block w-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formState.errors.email?.message && formState.touchedFields.email &&(
              <p className='text-red-500'>{formState.errors.email?.message }</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="gender">Gender</label>
            <select
            {...register("gender", 
            // {
            //   required: {
            //     value: true,
            //     message: "Please choose your gender."
            //   }
            // }
          )}
              id="gender"
              className="bg-gray-50 border border-blue-200 text-gray-900 text-sm rounded-2xl block w-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {formState.errors.gender?.message && formState.touchedFields.gender && (
              <p className='text-red-500'>{formState.errors.gender?.message }</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="dateOfBirth">Birth date</label>
            <input
            {...register("dateOfBirth",
            //   { required: {
            //     value: true,
            //     message: "Please enter your birth date."},
            //   valueAsDate:false,
              
            //       validate: function(value){
            //         const userDate = new Date(value).getFullYear();
            //         const nowDate = new Date().getFullYear();

            //         return nowDate - userDate >10 ? true : "Oops! You need to be older than 10 years to register.";
            //         //Validation function should return Bool ( 1 / 0 )
            //         // if(nowDate - userDate > 10 ){
            //         //   return true
            //         // }
            //         // else{
            //         //   return "invalid date"
            //         // }
            //       }
            // }

            )}
              type="date"
              id="dateOfBirth"
              className="bg-gray-50 border border-blue-200 text-gray-900 text-sm rounded-2xl block w-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formState.errors.dateOfBirth?.message && formState.touchedFields.dateOfBirth &&(
              <p className='text-red-500'>{formState.errors.dateOfBirth?.message }</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
            {...register("password",
              // {
              //   required:{value:true , message: "password is required"},
              //   pattern: {
              //     value: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,
              //     message: `password must contain 1 number (0-9),
              //     password must contain 1 uppercase letters,
              //     password must contain 1 lowercase letters,
              //     password must contain 1 non-alpha numeric number,
              //     password is 8-16 characters with no space`
              //   }
              // }
            )}
              type="password"
              id="password"
              placeholder="Password"
              className="bg-gray-50 border border-blue-200 text-gray-900 text-sm rounded-2xl block w-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formState.errors.password?.message && formState.touchedFields.password &&(
              <p className='text-red-500'>{formState.errors.password?.message }</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="rePassword">Confirm password</label>
            <input
            {...register("rePassword",
            //   {
            //         validate: function(rePasswordValue){
            //           if(rePasswordValue === watch("password")  ){
            //             return true
            //           }
            //           else {
            //             return "Not same password"
            //           }
            //         },
            //         required:{value:true , message: "confirm password is required"},   
            // }
          )}
              type="password"
              id="rePassword"
              placeholder="Confirm your password"
              className="bg-gray-50 border border-blue-200 text-gray-900 text-sm rounded-2xl block w-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formState.errors.rePassword?.message && formState.touchedFields.rePassword &&(
              <p className='text-red-500'>{formState.errors.rePassword?.message }</p>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Create new account
                  </>
                )}
          </button>

          <div className="text-center mt-5 text-sm text-gray-500">
            <span>Do you have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
