import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata = {
  title: "Login",
};

const login = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return (
    <div className="flex flex-col items-center lg:h-[100svh] lg:flex-row-reverse">
      <section className="h-64 w-full overflow-hidden  rounded-b-2xl lg:h-auto lg:flex-1 lg:self-stretch  lg:p-4">
        <Image
          className="block w-full  object-cover opacity-90 lg:h-full lg:w-full lg:rounded-2xl"
          src={"/images/loginHeroImg.jpg"}
          alt="loginHeroImage"
          width={500}
          height={500}
        />
      </section>
      <section className="px-6 py-4 sm:py-8 lg:flex-1">
        <div className="mx-auto max-w-lg space-y-4 sm:space-y-8 ">
          <div>
            <h1 className="text-2xl font-bold text-secondary-foreground">
              Hey, Hello &#128075;
            </h1>
            <p className="text-md text-muted-foreground">
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
