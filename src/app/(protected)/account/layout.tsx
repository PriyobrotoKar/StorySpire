import AccountSidebar from "@/components/AccountSidebar";

const AccountLayout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => {
  return (
    <section className="mx-auto flex max-w-screen-lg flex-col gap-4 px-4 py-12">
      <h1 className="text-xl font-bold">Account Settings:</h1>
      <aside className="hidden lg:block">sidebar</aside>
      <AccountSidebar />
      {children}
    </section>
  );
};

export default AccountLayout;
