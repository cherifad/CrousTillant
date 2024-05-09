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
          <Button
            size="icon"
            className="absolute top-0 right-2"
            onClick={() => {
              hideAnnouncement();
              setShow(false);
            }}
          >
            <Plus className="h-4 w-4 transform rotate-45" />
          </Button>
          <legend className="-ml-1 px-1 text-sm font-medium">
            {announcements.length} annonces récentes
          </legend>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {announcements.map((announcement) => {
              return (
                <div key={announcement.id} className="flex flex-col gap-2">
                  <h2 className="font-bold text-lg">{announcement.title}</h2>
                  <p>{announcement.content}</p>
                </div>
              );
            })}
          </div>
        </fieldset>
      )}
    </>
  );
}
