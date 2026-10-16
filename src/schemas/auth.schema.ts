import * as zod from "zod";

export const RegisterSchema = zod.object({
  name :zod
        .string()
        .nonempty("name is required")
        .min(3,"name should be 3 letters or more")
        .max(15,"name shouldn't be more than 15 letters"),

  email :zod
        .email()
        .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,"Invalid email")
        .nonempty("email is required"),

  dateOfBirth: zod.string()
        .nonempty("birth date is required")

        .refine((dateOfbirthValue) => {
                  const userDate = new Date(dateOfbirthValue).getFullYear(); //birth year
                  const nowDate = new Date().getFullYear(); //now

                  return nowDate - userDate > 10 ? true:false;
                }, "Oops! You need to be older than 10 years to register."),

  gender :zod.enum(["male", "female"]),

  password :zod.string()
                .nonempty("password is required")
                .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,`Your password must be at least 8 characters and include uppercase,
                  lowercase, a number, and a special character.`),
  rePassword : zod.string()
                  .nonempty("confirm password is required"),
}).refine( (object)=> {
  if(object.password === object.rePassword){
    return true
  }
  else{
    return false
  }
},{path:["rePassword"],
  error: "Password not matched"
});


export type RegisterSchemaType = zod.infer<typeof RegisterSchema>
////////////////////////////////////////////////////////////

export const LoginSchema = zod.object({
  email: zod
    .email("Invalid email")
    .nonempty("email is required"),

  password: zod
    .string()
    .nonempty("password is required"),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;