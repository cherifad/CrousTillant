"use client";
import { useEffect, useState } from "react";
import { Announcement } from "@prisma/client";
import {
  shouldShowAnnouncement,
  hideAnnouncement,
  showAnnouncement,
} from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";

export default function AnnouncementComponent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/announcement")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data));

    const shouldShow = shouldShowAnnouncement();

    if (!shouldShow.show) {
      if (announcements.length > 0) {
        if (shouldShow.date && announcements[0].created_at < shouldShow.date) {
          setShow(true);
          showAnnouncement();
        }
      }
      setShow(false);
    }
  }, []);

  return (
    <>
      {announcements.length > 0 && show && (
        <fieldset className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8 relative pt-7">
          <legend className="-ml-1 px-1 text-sm font-medium">
            {announcements.length} annonce{announcements.length > 1 && "s"}{" "}
            récente{announcements.length > 1 && "s"}
          </legend>
          <div>
            {announcements.map((announcement) => {
              return (
                <div key={announcement.id} className="flex flex-col gap-2">
                  <h2 className="font-bold text-lg">{announcement.title}</h2>
                  <p>{announcement.content}</p>
                  {announcements.indexOf(announcement) !==
                    announcements.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
          <Button
            className="w-fit"
            onClick={() => {
              setShow(false);
              hideAnnouncement();
            }}
          >
            <Plus className="h-4 w-4 transform rotate-45 mr-2" />
            Ne plus afficher
          </Button>
        </fieldset>
      )}
    </>
  );
}
