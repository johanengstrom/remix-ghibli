
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import authenticator from "~/services/auth.server";
// import { sessionStorage } from "~/services/session.server";

/**
 * check the user to see if there is an active session, if not
 * redirect to login page
 *
 * @param param0
 * @returns
 */
export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

/**
 *  handle the logout request
 *
 * @param param0
 */
export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export default function DashboardPage() {
  const data = useLoaderData();
  // console.log(data);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="text-5xl font-bold text-center">Protected Dashboard</h1>
      <p>Logged in as: {data?.name}   {data?.token}</p>
      <div className="flex justify-end">
      <Link 
        to='films'
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
        >
          Browse Ghibli Films
          </Link>
      <Form method="post">
        <button 
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2'
          >
            Log Out
          </button>
      </Form>
      </div>
    </div>
  );
}