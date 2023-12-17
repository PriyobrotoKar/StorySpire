"use client";
import { Social } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { fetchDataFromApi, patchFetchAPi } from "@/utils/fetchData";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialLinkSettingItem from "./SocialLinksSettingsItems";
import { updateUser } from "@/utils/fetchActions";
import { Loader2 } from "lucide-react";

const SocialLinksSettings = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [initialLinks, setInitialLinks] = useState<Social[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const updateLinks = async () => {
    fetchDataFromApi("/api/social").then((data) => {
      setSocials(data);
      setInitialLinks(data);
    });
  };

  const handleDrangEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      if (active.id === over?.id) return;

      setSocials((socials) => {
        const oldIndex = socials.findIndex((social) => social.id === active.id);
        const newIndex = socials.findIndex((social) => social.id === over.id);

        return arrayMove(socials, oldIndex, newIndex);
      });
    }
  };

  const handleSaveOrder = async () => {
    if (JSON.stringify(initialLinks) !== JSON.stringify(socials)) {
      setIsSaving(true);
      const res = await patchFetchAPi("/api/social", socials);
      await updateLinks();
      setIsSaving(false);
      await updateUser();
    }
  };

  useEffect(() => {
    fetchDataFromApi("/api/social").then((data) => {
      setSocials(data);
      setInitialLinks(data);
    });
  }, []);

  return (
    <div className="space-y-2">
      {JSON.stringify(initialLinks) !== JSON.stringify(socials) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Save Changes?</CardTitle>
            <CardDescription>
              Save the changes made in the order of the links
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end gap-2">
            <Button
              onClick={(e) => setSocials(initialLinks)}
              size={"sm"}
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isSaving} onClick={handleSaveOrder} size={"sm"}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                "Save"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDrangEnd}>
        <SortableContext items={socials} strategy={verticalListSortingStrategy}>
          {socials.map((social) => {
            return (
              <SocialLinkSettingItem
                key={social.id}
                social={social}
                updateLinks={updateLinks}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SocialLinksSettings;
