"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Search,
  Pencil,
  X,
  Minus,
  Paperclip,
  Link2,
  Smile,
  ImageIcon,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export function InboxSection() {
  const [emails, setEmails] = useState([
    {
      id: 1,
      sender: "Nelson lane",
      preview: "Lorem ipsum perspiciatis unde omnis iste natus",
      time: "12:30 PM",
      starred: false,
    },
    {
      id: 2,
      sender: "Nelson lane",
      preview: "Lorem ipsum perspiciatis unde omnis iste natus",
      time: "12:30 PM",
      starred: true,
    },
    {
      id: 3,
      sender: "Nelson lane",
      preview: "Lorem ipsum perspiciatis unde omnis iste natus",
      time: "12:30 PM",
      starred: false,
    },
  ]);

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [recipients, setRecipients] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");

  const toggleStar = (id) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, starred: !email.starred } : email
      )
    );
  };

  const handleSend = () => {
    console.log("Sending email:", { recipients, cc, bcc, subject, bodyText });
    setIsComposeOpen(false);
    setRecipients("");
    setCc("");
    setBcc("");
    setSubject("");
    setBodyText("");
    setShowCcBcc(false);
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Sidebar */}
      <div className="w-64 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-4">Inbox</h2>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white hover:bg-amber-100 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-sm font-medium">Email</span>
            </div>
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              4
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search here..." className="pl-9" />
        </div>
      </div>

      {/* Email List */}
      <Card className="flex-1 relative p-0">
        <div className="divide-y">
          {emails.map((email) => (
            <div
              key={email.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(email.id);
                }}
                className="flex-shrink-0"
              >
                <Star
                  className={`h-5 w-5 ${
                    email.starred
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="font-medium text-sm flex-shrink-0">
                      {email.sender}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      {email.preview}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground flex-shrink-0">
                    {email.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compose Button */}
        <Button
          onClick={() => setIsComposeOpen(true)}
          className="fixed bottom-6 right-6 flex items-center justify-center md:justify-start gap-2 h-14 w-14 md:h-12 md:w-auto md:px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full md:rounded-full shadow-lg transition-all duration-200"
        >
          <Pencil className="h-6 w-6 md:h-5 md:w-5" />
          <span className="hidden md:inline font-medium">Compose</span>
        </Button>
      </Card>

      {/* Compose Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl p-0 rounded-lg overflow-hidden">
          <DialogHeader className="bg-[#1C5941] text-white p-4 m-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white m-0">New Message</DialogTitle>
              <div className="flex items-center gap-1"></div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Recipients"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowCcBcc(!showCcBcc)}
                className="text-sm whitespace-nowrap"
              >
                Cc Bcc
              </Button>
            </div>

            {showCcBcc && (
              <div className="space-y-3">
                <Input
                  placeholder="Cc"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                />
                <Input
                  placeholder="Bcc"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                />
              </div>
            )}

            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <Textarea
              placeholder="Body Text"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="min-h-[300px] resize-none p-4"
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-1">
                <Button
                  onClick={handleSend}
                  className="bg-emerald-700 hover:bg-emerald-800 px-4"
                >
                  Send
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
                <div className="flex items-center gap-1 ml-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
