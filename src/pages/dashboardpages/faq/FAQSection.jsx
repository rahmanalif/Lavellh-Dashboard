"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const [faqs, setFaqs] = useState([
    {
      id: "1",
      question: "How do I book a service App?",
      answer:
        "Select your service, pick a date & time, and confirm. You'll get a notification with details.",
    },
    {
      id: "2",
      question: "Can I reschedule or cancel my booking?",
      answer:
        "Yes, you can reschedule or cancel your booking from your account dashboard.",
    },
    {
      id: "3",
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit cards, debit cards, and digital payment methods.",
    },
    {
      id: "4",
      question: "How do I contact the service provider?",
      answer:
        "You can contact the service provider through the messaging feature in your booking details.",
    },
    {
      id: "5",
      question: "Is my personal information safe?",
      answer:
        "Yes, we use industry-standard encryption to protect your personal information.",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddFaq = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newFaq = {
        id: Date.now().toString(),
        question: newQuestion,
        answer: newAnswer,
      };
      setFaqs([...faqs, newFaq]);
      setNewQuestion("");
      setNewAnswer("");
      setIsAddDialogOpen(false);
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setIsEditDialogOpen(true);
  };

  const handleUpdateFaq = () => {
    if (editingFaq && newQuestion.trim() && newAnswer.trim()) {
      setFaqs(
        faqs.map((faq) =>
          faq.id === editingFaq.id
            ? { ...faq, question: newQuestion, answer: newAnswer }
            : faq
        )
      );
      setNewQuestion("");
      setNewAnswer("");
      setEditingFaq(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteFaq = (id) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">FAQ</h2>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#1C5941] hover:bg-[#1C5941]"
        >
          Add New FAQ
        </Button>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="rounded-lg border bg-background px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="text-left text-sm">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditFaq(faq)}
                    className="border-[#1C5941] text-[#1C5941] hover:bg-emerald-50 hover:text-[#1C5941]"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Add FAQ Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsAddDialogOpen(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle>Add FAQ</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                placeholder="How do I book a service App?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                placeholder="Enter description..."
                rows={5}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddFaq}
              className="w-full bg-[#1C5941] hover:bg-emerald-800"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditDialogOpen(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle>Edit FAQ</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-question">Question</Label>
              <Input
                id="edit-question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-answer">Answer</Label>
              <Textarea
                id="edit-answer"
                rows={5}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
            </div>
            <Button
              onClick={handleUpdateFaq}
              className="w-full bg-[#1C5941] hover:bg-emerald-800"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
