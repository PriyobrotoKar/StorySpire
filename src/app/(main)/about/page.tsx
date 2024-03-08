import { Separator } from "@/components/ui/separator";

const techstacks = [
  {
    name: "Next.js",
    link: "https://nextjs.org/",
  },
  {
    name: "Tailwind CSS",
    link: "https://tailwindcss.com/",
  },
  {
    name: "NextAuth",
    link: "https://next-auth.js.org/",
  },
  {
    name: "Prisma",
    link: "https://www.prisma.io/",
  },
  {
    name: "Cloudinary",
    link: "https://cloudinary.com/",
  },
  {
    name: "EditorJs",
    link: "https://editorjs.io/",
  },
  {
    name: "MongoDB",
    link: "https://www.mongodb.com/",
  },
  {
    name: "Shadcn UI",
    link: "https://ui.shadcn.com/",
  },
];

const socials = [
  { name: "Twitter", link: "https://twitter.com/priyobrotokar" },
  { name: "LinkedIn", link: "https://www.linkedin.com/in/priyobrotokar/" },
  { name: "GitHub", link: "https://github.com/PriyobrotoKar" },
  { name: "Discord", link: "https://discord.com/users/774217882698776589" },
];

const features = [
  "User registration and login system to manage user accounts.",
  "Basic user roles like author and reader.",
  " Create, edit, and delete blog posts.",
  " Format text (e.g., bold, italic, headings) and upload images for blog posts.",
  " Display a list of blog posts on the home page.",
  " View individual blog posts with their content, author, date, and comments.",
  " Categorise blog posts into different topics or categories.",
  " Add tags to blog posts for easy searching and filtering.",
  " Implement a search bar to search for blog posts by keywords.",
  " Allow users to filter blog posts by categories, tags, or dates.",
  " Allow users to categorize blog posts and add tags for organization.",
  " Create user profiles displaying basic information and authored blog posts.",
  " Implement a featurerich text editor for creating and formatting blog posts.",
  " Allow users to comment on blog posts.",
  " Provide like and share functionality for blog posts.",
  " Enable users to share blog posts on various social media platforms.",
  " Enable users to follow their favourite authors or topics.",
];

const page = () => {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-3xl font-semibold">About</h1>
      <p>About the project and the author of the project.</p>

      <Separator className="my-2" />

      <p>
        This is a fullstack modern blogging platform built with everything new
        in{" "}
        <a href="https://nextjs.org/" className="font-medium underline">
          Next.js
        </a>
        .
      </p>

      <h2 className="mt-6 text-lg font-semibold">Timeline</h2>
      <p>
        4 months, <span className="font-medium">Deployed in March 10,2023</span>
      </p>

      <h2 className="mt-6 text-lg font-semibold">Tech stack used</h2>
      <Separator className="my-2" />
      <ul className="ml-4 list-disc">
        {techstacks.map((tech) => {
          return (
            <li key={tech.name}>
              <a className="font-medium underline" href={tech.link}>
                {tech.name}
              </a>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-6 text-lg font-semibold">Features Implemented</h2>
      <Separator className="my-2" />
      <ul className="ml-4 list-disc">
        {features.map((feature) => {
          return <li key={feature}>{feature}</li>;
        })}
      </ul>

      <h2 className="mt-6 text-lg font-semibold">About the author</h2>
      <Separator className="my-2" />
      <p>
        Hi, I&apos;m <span className="font-medium">Priyobroto Kar</span>. A
        full-stack developer and CS student, juggling code and coffee with a
        passion for building cool stuff online. My socials are below.
      </p>
      <ul className="ml-4 mt-2 list-disc">
        {socials.map((social) => {
          return (
            <li key={social.name}>
              <a className="font-medium underline" href={social.link}>
                {social.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default page;
