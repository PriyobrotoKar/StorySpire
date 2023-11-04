import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export const metadata = {
  title: "Login",
};

const login = () => {
  return (
    <div className="flex flex-col lg:flex-row-reverse lg:h-[100svh] items-center">
      <section className="h-64 w-full lg:h-auto  lg:self-stretch lg:flex-1 lg:p-4 rounded-b-2xl  overflow-hidden">
        <Image
          className="w-full block  lg:w-full object-cover lg:h-full opacity-90 lg:rounded-2xl"
          src={"/images/loginHeroImg.jpg"}
          alt="loginHeroImage"
          width={500}
          height={500}
        />
      </section>
      <section className="lg:flex-1 px-6 py-4 sm:py-8">
        <div className="max-w-lg mx-auto space-y-4 sm:space-y-8 ">
          <div>
            <h1 className="text-2xl font-bold text-black">
              Hey, Hello &#128075;
            </h1>
            <p className="text-muted-foreground text-md">
              Enter your information to login or create a new account
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </div>
  );
};

export default login;
