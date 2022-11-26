import { NextPage } from "next";
import { Routes } from "../enums/routes.enum";

export async function getServerSideProps() {
  return {
    redirect: {
      destination: Routes.SignIn,
      permanent: false,
    },
  };
}

const SignOut: NextPage = () => {
  return <div>Signed Out</div>;
};

export default SignOut;
