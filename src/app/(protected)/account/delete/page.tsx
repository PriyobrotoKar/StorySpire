import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="space-y-4">
      <main>
        <h1 className="text-2xl font-semibold">
          We&apos;re sorry to see you go
        </h1>
        <p>
          Be advised, account deletion is{" "}
          <span className="font-medium">final</span>. There will be no way to
          restore your account.
        </p>
      </main>
      <div className="space-x-4">
        <Button variant={"secondary"}>Nevermind</Button>
        <Button variant={"destructive"}>Delete my account</Button>
      </div>
    </div>
  );
};

export default page;
