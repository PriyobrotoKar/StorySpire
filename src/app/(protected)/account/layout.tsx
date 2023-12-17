import AccountSidebar from "@/components/AccountSidebar";

const AccountLayout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => {
  return (
    <section className="container mx-auto space-y-4 px-4 py-12 sm:py-20 lg:max-w-screen-lg lg:py-32">
      <h1 className="text-xl font-bold">Account Settings:</h1>
      <main className="flex flex-col gap-4 md:flex-row md:gap-12 ">
        <AccountSidebar />
        <section className="flex-1">{children}</section>
      </main>
    </section>
  );
};

export default AccountLayout;
