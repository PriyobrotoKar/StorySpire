"use client";
import { Social } from "@prisma/client";
import { social as socialObj } from "@/utils/socials";
import React, { useEffect, useState } from "react";
import LinkIcon from "./LinkIcon";
import { capitalize } from "@/utils/helpers";
import { Input } from "./ui/input";
import { MdDragIndicator } from "react-icons/md";
import { Button } from "./ui/button";
import { FaTrash } from "react-icons/fa6";
import { extractDomain } from "@/utils/extractDomain";
import { fetchDataFromApi, patchFetchAPi } from "@/utils/fetchData";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";
import { revalidateTag } from "next/cache";
import { updateUser } from "@/utils/fetchActions";
import { Loader2 } from "lucide-react";

const SocialLinkSettingItem = ({
  social,
  update,
}: {
  social: Social;
  update: () => Promise<void>;
}) => {
  const [input, setInput] = useState(social.link);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsUpdated(e.target.value !== social.link);
  };

  const handleSave = async () => {
    if (isUpdated) {
      setIsSaving(true);
      const res = await patchFetchAPi(`/api/social/${social.id}`, {
        link: input,
        name: extractDomain(input),
      });
      setIsSaving(false);
      setIsUpdated(false);
      toast({
        variant: "default",
        title: "Link Updated Successfully",
        description: "Head back to your profile page to see the changes",
        action: (
          <ToastAction
            onClick={() => router.push(`/@${res.user.username}`)}
            altText="Go To Profile"
          >
            Profile
          </ToastAction>
        ),
      });
      await update();
      await updateUser();
    }
  };
  return (
    <div
      className="group flex gap-2 rounded-lg bg-secondary/60 p-2"
      style={{
        backgroundColor: `${
          socialObj[extractDomain(input) as keyof typeof socialObj]?.color +
          "30"
        }`,
      }}
    >
      <div className="flex-initial pt-1">
        <MdDragIndicator />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-fit rounded-sm bg-accent-foreground/50 p-1.5 text-white"
              style={{
                backgroundColor: `${socialObj[
                  extractDomain(input) as keyof typeof socialObj
                ]?.color}`,
                boxShadow: `0 4px 20px 5px ${
                  socialObj[extractDomain(input) as keyof typeof socialObj]
                    ?.color + "60"
                }`,
              }}
            >
              <LinkIcon link={input} />
            </div>
            <div className="font-medium">
              {capitalize(extractDomain(input))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUpdated && (
              <Button
                disabled={isSaving}
                onClick={handleSave}
                variant={"secondary"}
                size={"sm"}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            )}
            <Button
              className="pointer-events-none opacity-0 transition-opacity delay-300 group-hover:pointer-events-auto group-hover:opacity-100"
              variant={"destructive"}
              size={"sm"}
            >
              <FaTrash />
            </Button>
          </div>
        </div>
        <div>
          <Input
            type="url"
            value={input}
            onChange={handleInputChange}
            placeholder="Type URL here..."
            autoComplete="url"
          />
        </div>
      </div>
    </div>
  );
};

const SocialLinksSettings = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const updateLinks = async () => {
    fetchDataFromApi("/api/social").then((data) => setSocials(data));
  };

  useEffect(() => {
    fetchDataFromApi("/api/social").then((data) => setSocials(data));
  }, []);

  return (
    <div className="space-y-2">
      {socials.map((social) => {
        return (
          <SocialLinkSettingItem
            key={social.id}
            social={social}
            update={updateLinks}
          />
        );
      })}
    </div>
  );
};

export default SocialLinksSettings;
