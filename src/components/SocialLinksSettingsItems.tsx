import LinkIcon from "./LinkIcon";
import { capitalize } from "@/utils/helpers";
import { Input } from "./ui/input";
import { MdDragIndicator } from "react-icons/md";
import { social as socialObj } from "@/utils/socials";
import { FaTrash } from "react-icons/fa6";
import { extractDomain } from "@/utils/extractDomain";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { updateUser } from "@/utils/fetchActions";
import { Loader2 } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

import { deleteFetchAPi, patchFetchAPi } from "@/utils/fetchData";
import { Social } from "@prisma/client";
import { useState } from "react";
import { Button } from "./ui/button";

const SocialLinkSettingItem = ({
  social,
  updateLinks,
}: {
  social: Social;
  updateLinks: () => Promise<void>;
}) => {
  const { attributes, listeners, transform, setNodeRef, transition } =
    useSortable({ id: social.id });
  const [input, setInput] = useState(social.link);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const dndStyles = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsUpdated(e.target.value !== social.link);
  };

  const saveLink = async () => {
    setIsProcessing(true);
    const sanitizedLink =
      input[input.length - 1] === "/" ? input.slice(0, -1) : input;
    const res = await patchFetchAPi(`/api/social/${social.id}`, {
      link: sanitizedLink,
      name: extractDomain(input),
    });
    await updateLinks();
    setIsProcessing(false);
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
    await updateUser();
  };

  const deleteLink = async () => {
    setIsProcessing(true);
    const res = await deleteFetchAPi(`/api/social/${social.id}`);
    setIsProcessing(false);
    await updateLinks();
    toast({
      variant: "default",
      title: res.message,
    });
    await updateUser();
  };

  const handleSave = async () => {
    if (isUpdated) {
      if (input) {
        await saveLink();
      } else {
        //TODO: Delete Todo
        await deleteLink();
      }
    }
  };
  return (
    <div
      ref={setNodeRef}
      className="group relative z-0 flex touch-none gap-2 rounded-lg bg-secondary/60 p-2 backdrop-blur-sm active:z-30"
      style={{
        backgroundColor: `${
          (socialObj[extractDomain(input) as keyof typeof socialObj]?.color ||
            "#cbd5e1") + "30"
        }`,
        ...dndStyles,
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className=" flex-initial cursor-grab pt-2 active:cursor-grabbing"
      >
        <MdDragIndicator />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-fit rounded-sm bg-accent-foreground/50 p-1.5 text-slate-500"
              style={{
                backgroundColor: `${
                  socialObj[extractDomain(input) as keyof typeof socialObj]
                    ?.color || "#cbd5e1"
                }`,
                boxShadow: `0 4px 20px 5px ${
                  (socialObj[extractDomain(input) as keyof typeof socialObj]
                    ?.color || "#6c6f73") + "60"
                }`,
                color:
                  socialObj[extractDomain(input) as keyof typeof socialObj]
                    ?.color && "white",
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
                disabled={isProcessing}
                onClick={handleSave}
                variant={"secondary"}
                size={"sm"}
              >
                {isProcessing ? (
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
              onClick={deleteLink}
              className={
                "pointer-events-none opacity-0 transition-opacity delay-300 group-hover:pointer-events-auto " +
                (isUpdated ? "opacity-100" : " group-hover:opacity-100")
              }
              variant={"destructive"}
              size={"sm"}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FaTrash />
              )}
            </Button>
          </div>
        </div>
        <div>
          <Input
            draggable={true}
            onDragStart={(event) => event.preventDefault()}
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

export default SocialLinkSettingItem;
