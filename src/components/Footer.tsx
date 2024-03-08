import Image from "next/image";
import Link from "next/link";
import LinkIcon from "./LinkIcon";

const navLinks = [
  { name: "Home", link: "/" },
  { name: "Explore", link: "/explore" },
  { name: "Bookmarks", link: "/bookmarks" },
  { name: "About", link: "/about" },
];
const socialLinks = [
  "https://github.com/PriyobrotoKar",
  "https://www.linkedin.com/in/priyobrotokar/",
  "https://twitter.com/priyobrotokar",
  "https://www.instagram.com/_.d.a.n.t.e_._/",
];

const Footer = () => {
  return (
    <footer className="mt-auto bg-secondary-foreground py-6 text-sm  text-primary-foreground lg:py-10">
      <div className="container mx-auto space-y-8 ">
        <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Image src={"/logo-white.svg"} alt="logo" width={150} height={80} />
          </div>
          <div className="space-x-6">
            {navLinks.map((link) => {
              return (
                <Link key={link.link} href={link.link}>
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="flex gap-4 text-base">
            {socialLinks.map((socials) => {
              return (
                <a key={socials} href={socials}>
                  <LinkIcon link={socials} />
                </a>
              );
            })}
          </div>
        </section>
        <section className="flex flex-col gap-4 text-muted-foreground sm:flex-row-reverse sm:justify-between">
          <Link href={"/"}>Privacy Policy</Link>
          <p>
            Built by{" "}
            <a
              target="_blank"
              className="font-medium transition-colors hover:text-muted"
              href="https://twitter.com/priyobrotokar"
            >
              PriyobrotoKar
            </a>{" "}
            2023
          </p>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
