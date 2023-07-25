import { Center } from "@chakra-ui/react";
import Card from "../components/form/card";
import SubCard from "../components/form/sub-card";
import LoginForm from "../components/form/login-form";

function Login() {
  return (


      <Center flexGrow={1} p={[4, 4, 0]} mt={[4, 8, 16]}>
        <Card>
          <SubCard
            textHoverColor="text-blue"
            bgColor="bg-primary"
            route="/signup"
            question="Don't have an account"
            btnText="Sign Up"
          />
          <LoginForm />
        </Card>
      </Center>

  );
}

export default Login;
