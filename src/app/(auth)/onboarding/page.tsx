import React from "react";

import OnBoardingForm from "@/components/OnBoardingForm";

const onbaording = () => {
  return (
    <section className="flex min-h-[inherit] items-center justify-center px-4">
      <main className="rounded-xl border">
        <header className="border-b  p-4">
          <h1 className="text-xl font-bold text-secondary-foreground">
            Choose a username
          </h1>
          <p className="text-md text-muted-foreground">
            Choose a username and write a brief introduction.
          </p>
        </header>

        <OnBoardingForm />
      </main>
    </section>
  );
};

export default onbaording;
