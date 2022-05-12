import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import authenticator from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

  
  /**
   * called when the user hits button to login
   *
   * @param param0
   * @returns
   */
  export const action: ActionFunction = async ({ request, context }) => {
    // call my authenticator
    const resp = await authenticator.authenticate("form", request, {
      successRedirect: "/",
      failureRedirect: "/login",
      throwOnError: true,
      context,
    });
    // console.log(resp);
    return resp;
  };
  
  /**
   * get the cookie and see if there are any errors that were
   * generated when attempting to login
   *
   * @param param0
   * @returns
   */
  export const loader: LoaderFunction = async ({ request }) => {
  
    await authenticator.isAuthenticated(request, {
      successRedirect : "/"
    });
  
    const session = await sessionStorage.getSession(
      request.headers.get("Cookie")
    );
  
    const error = session.get("sessionErrorKey");
    return json<any>({ error });
  };
  
  /**
   *
   * @returns
   */
  export default function LoginPage() {
    // if i got an error it will come back with the loader data
    const loaderData = useLoaderData();
    // console.log(loaderData);
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
        <h1 className="text-5xl font-bold text-center py-3">Remix-Auth Test</h1>
        
        <div className='flex justify-center'>
        <Form method="post">
          <input 
            className='border-2 rounded py-2 px-3' 
            type="email" 
            name="email" 
            placeholder="email" 
            required 
            />
          <input 
            className='border-2 rounded py-2 px-3'
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
          />
          <button 
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2'>
                Sign In
            </button>
        </Form>
        </div>
        <div>
          {loaderData?.error ? <p>ERROR: {loaderData?.error?.message}</p> : null}
        </div>
      </div>
    );
  }